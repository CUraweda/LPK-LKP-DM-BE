import BaseService from "../../base/service.base.js";
import memberConstant from "../../config/member.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";

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

  extendDataSiswa = async (payload) => {
    const id = payload.memberId
    return await this.db.$transaction(async (prisma) => {
      const { name, ...data } = payload
      await prisma.memberIdentity.upsert({ where: { memberId: id }, create: data, update: data })
      await prisma.member.update({ where: { id }, data: { name, memberState: memberConstant.memberState.Data_Ibu } })
    })
  }

  formatUIDParent = (memberId, relation) => {
    return `${memberId}|${relation}`
  }

  extendDataIbu = async (payload) => {
    const id = payload.memberId
    const uid = this.formatUIDParent(id, "I")
    payload['uid'] = uid
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberParent.upsert({ where: { memberId: id, uid, relation: "I" }, create: { ...payload, relation: "I" }, update: { ...payload, relation: "I" } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Data_Ayah } })
    })
  }
  
  extendDataAyah = async (payload) => {
    const id = payload.memberId
    const uid = this.formatUIDParent(id, "A")
    payload['uid'] = uid
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberParent.upsert({ where: { memberId: id, uid, relation: "A" }, create: { ...payload, relation: "A" }, update: { ...payload, relation: "A" }  })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Data_Wali } })
    })
  }
  
  extendDataWali = async (payload) => {
    const id = payload.memberId
    const uid = this.formatUIDParent(id, "W")
    payload['uid'] = uid
    if(payload.parentAsGuardian) return await this.db.$transaction(async (prisma) => {
      await prisma.memberIdentity.update({ where: { memberId: id }, data: { isParentGuardian: true } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Pilih_Kursus } })
    })
    delete payload.parentAsGuardian
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberParent.upsert({ where: { memberId: id, uid, relation: "W" }, create: { ...payload, relation: "W" }, update: { ...payload, relation: "W" } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Pilih_Kursus } })
    })
  }

  extendDataTraining = async (payload) => {
    const id = payload.memberId
    return await this.db.$transaction(async (prisma) => {
      const trainingData = await prisma.training.findFirst({ where: { id: payload.trainingId } })
      if(!trainingData) throw new BadRequest("Data Training tidak ditemukan")
      await prisma.memberCourse.update({ where: { memberId: id }, data: { memberId: id, trainingId: trainingData.id, status: "Sedang" } })
      await prisma.member.update({where: { id }, data: { currentCourseId: payload.trainingId, totalCoursePrice: "2000000", totalCourses: 1 } })
    })
  }

  extendDataPembayaran = async(payload) => {
    const id = payload.memberId
    return await this.db.$transaction(async (prisma) => {
      await prisma.memberTransaction.create({ data: { memberId: id, paymentTotal: user.member.totalCousePrice, } })
    })
  }
}

export default memberService;  
