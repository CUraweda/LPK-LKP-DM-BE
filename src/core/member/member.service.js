import BaseService from "../../base/service.base.js";
import memberConstant from "../../config/member.js";
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
      await prisma.memberIdentity.upsert({ where: { memberId: id }, data })
      await prisma.member.update({ where: { id }, data: { name, memberState: memberConstant.memberState.Data_Ibu } })
    })
  }

  extendDataIbu = async (user, payload) => {
    const id = user.member.id
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberParent.upsert({ where: { memberId: id }, create: { ...payload, relation: "I" }, update: { ...payload, relation: "I" } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Data_Ayah } })
    })
  }

  extendDataAyah = async (user, payload) => {
    const id = user.member.id
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberParent.upsert({ where: { memberId: id }, create: { ...payload, relation: "A" }, update: { ...payload, relation: "A" }  })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Data_Wali } })
    })
  }

  extendDataWali = async (user, payload) => {
    const id = user.member.id
    if(payload.parentAsGuardian) return await this.db.$transaction(async (prisma) => {
      await prisma.memberIdentity.update({ where: { memberId: id }, data: { isParentGuardian: true } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Pilih_Kursus } })
    })
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberParent.upsert({ where: { memberId: id }, create: { ...payload, relation: "W" }, update: { ...payload, relation: "W" } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Pilih_Kursus } })
    })
  }

}

export default memberService;  
