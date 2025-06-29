import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class chatService extends BaseService {
  constructor() {
    super(prisma);
  }
  
  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.chat.findMany({ ...q, orderBy: { sentAt: 'asc' } });

    if (query.paginate) {
      const countData = await this.db.chat.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.chat.findUnique({ where: { id: +id } });
    return data;
  };

  findByUser = async (id) => {
    const data = await this.db.chat.findMany({ orderBy: { sentAt: 'asc' }, where: { receiverId: id, senderId: id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.chat.create({ data: payload });
    return data;
  };

  send = async (payload) => {
    const data = await this.db.chat.create({ data: payload });
    return data;
  };

  sendToAdmin = async (payload) => {
    const adminDatas = await this.db.user.findMany({ where: { role: { code: "ADMIN" } } })
    const data = await this.db.chat.createMany({
      data: adminDatas.map((admin) => ({
        receiverId: admin.id, sentAt: new Date(),
        ...payload
      }))
    })
    return data
  }

  update = async (id, payload) => {
    const data = await this.db.chat.update({ where: { id: +id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.chat.delete({ where: { id: +id } });
    return data;
  };
}

export default chatService;  
