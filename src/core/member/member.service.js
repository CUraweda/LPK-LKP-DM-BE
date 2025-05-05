import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class memberService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.member.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.member.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.member.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.member.create({ data: payload });
    return data;
  };

  patchVerified = async (id, payload) => {
    const data = await this.db.member.update({ where: { id }, data: { dataVerified: payload.verified } });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.member.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.member.delete({ where: { id } });
    return data;
  };

  extendDataSiswa = async (user, payload) => {
    const id = user.member.id
    return await this.db.$transaction(async (prisma) => {
      const { name, ...data } = payload
      await prisma.member.update({ where: { id }, data: { name } })
      await prisma.memberIdentity.upsert({ where: { memberId: id }, data })
    })
  }
}

export default memberService;  
