import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { sendOn } from "../../socket/index.js";
import { BadRequest } from "../../exceptions/catch.execption.js";
import userService from "../user/user.service.js";

class chatrecapService extends BaseService {
  #userService
  constructor() {
    super(prisma);
    this.#userService = new userService()
  }

  findAll = async (query) => {
    const { name, only_unread } = query
    const q = this.transformBrowseQuery(query);
    delete q.take; delete q.skip;
    if (name) q.where['user'] = { member: { name: { contains: name } } }
    if (only_unread == "1") q.where['unreadedMessage'] = { gte: 1 }

    const data = await this.db.chatRecap.findMany({
      ...q, include: {
        user: {
          select: {
            member: {
              select: { name: true,  }
            }
          }
        },
        Chat: { select: { senderId: true, message: true, type: true, sentAt: true }, orderBy: { sentAt: "desc" }, take: 1 }
      }
    });
    return data;
  };

  findById = async (id) => {
    const data = await this.db.chatRecap.findUnique({ where: { id } });
    return data;
  };

  findMessages = async (id) => {
    const data = await this.db.chatRecap.findFirst({ where: { id }, select: { userId: true, totalMessage: true, unreadedMessage: true, Chat: { include: { sender: { select: { member: { select: { name: true } } } } }, orderBy: { sentAt: 'asc' } } } });
    return data;
  };

  create = async (userId) => {
    const check = await this.db.chatRecap.findFirst({ where: { id: userId } })
    if (check) throw new BadRequest("Data dengan User ID sudah ada")
    const data = await this.db.chatRecap.create({ data: { id: userId, userId } });
    return data;
  };

  findNewChat = async () => {
    const data = await this.db.user.findMany({ where: { ChatRecap: null } })
    return data
  }

  checkAndCreate = async (userId) => {
    const data = await this.db.chatRecap.findFirst({ where: { id: userId } })
    if (data) return userId
    const created = await this.create(userId)
    return created.id
  }

  newMessage = async (id, args = { messageUp: true, unreadUp: true }) => {
    const data = await this.db.chatRecap.findFirst({ where: { id } })
    if (!data) return false

    if (args.messageUp) data.totalMessage++
    if (args.unreadUp) data.unreadedMessage++

    await this.db.chatRecap.update({ where: { id }, data })

    sendOn("message_refresh", { userIds: [data.userId, ...(await this.#userService.getAllAdminIds())] })

  }

  readMessage = async (id) => {
    const data = await this.db.chatRecap.findFirst({ where: { id } })
    if (!data) throw new BadRequest("Data tidak ditemukan")
    await this.db.chatRecap.update({ where: { id }, data: { unreadedMessage: 0 } })
    sendOn("message_refresh", { userIds: [data.userId, ...(await this.#userService.getAllAdminIds())] })
  }

  update = async (id, payload) => {
    if (payload['userId']) {
      const data = await this.db.chatRecap.findFirst({ where: { id: payload['userId'] } })
      if (data) throw new BadRequest("Data Dengan User ID yang disertakan telah ada")
      payload['id'] = payload['userId']
    }
    const data = await this.db.chatRecap.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.chatRecap.delete({ where: { id } });
    return data;
  };
}

export default chatrecapService;  
