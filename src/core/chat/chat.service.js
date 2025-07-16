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

  countRecap = async () => {
    let start_date = new Date()
    let end_date = new Date()
    start_date.setHours(0, 0, 0, 0);
    end_date.setHours(23, 59, 59, 999);

    let recapData = { chatBaru: 0, totalChat: 0 }
    recapData.chatBaru = await this.db.chat.count({ where: { sender: { role: { code: "SISWA" } }, sentAt: { gte: start_date, lte: end_date } } })
    recapData.totalChat = await this.db.chat.count()

    return recapData
  }

  findById = async (id) => {
    const data = await this.db.chat.findUnique({ where: { id: +id } });
    return data;
  };

  findByUser = async (id) => {
    const data = await this.db.chat.findMany({ orderBy: { sentAt: 'asc' }, where: { receiverId: id, senderId: id } });
    return data;
  };

  sendAdmin = async (payload) => {
    const data = await this.db.chat.create({ data: payload });
    return data;
  };

  send = async (payload) => {
    const data = await this.db.chat.create({ data: payload });
    return data;
  };

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
