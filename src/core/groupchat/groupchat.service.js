import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class groupchatService extends BaseService {
  constructor() {
    super(prisma);
  }

  formatSenderReceiver = (payload) => {
    const { senderId, receiverId } = payload
    return {
      groupSenderId: senderId + "|" + receiverId,
      groupReceiverId: receiverId + "|" + senderId
    }
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.groupChat.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.groupChat.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.groupChat.findUnique({ where: { id } });
    return data;
  };

  checkGroupChat = async (payload) => {
    let data = await this.db.groupChat.findFirst({ where: { ...this.formatSenderReceiver(payload) } })
    if(!data) data = await this.create(payload)

    return data
  }

  create = async (payload) => {
    const groupData = this.formatSenderReceiver(payload)
    const data = await this.db.groupChat.create({ data: { ...payload, ...groupData } });
    return data;
  };
  
  update = async (id, payload) => {
    const data = await this.db.groupChat.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.groupChat.delete({ where: { id } });
    return data;
  };
}

export default groupchatService;  
