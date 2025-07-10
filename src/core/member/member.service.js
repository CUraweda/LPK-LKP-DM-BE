import BaseService from "../../base/service.base.js";
import memberConstant from "../../config/member.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";
import paymentService from "../payment/payment.service.js";

class memberService extends BaseService {
  constructor() {
    super(prisma);
    this.paymentService = new paymentService()
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
      const { name, profileImage, ...data } = payload
      await prisma.memberIdentity.upsert({ where: { memberId: id }, create: data, update: data })
      await prisma.member.update({ where: { id }, data: { name, memberState: memberConstant.memberState.Data_Ibu, profileImage } })
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
      await prisma.memberParent.upsert({ where: { memberId: id, uid, relation: "A" }, create: { ...payload, relation: "A" }, update: { ...payload, relation: "A" } })
      await prisma.member.update({ where: { id }, data: { memberState: memberConstant.memberState.Data_Wali } })
    })
  }

  extendDataWali = async (payload) => {
    const id = payload.memberId
    const uid = this.formatUIDParent(id, "W")
    payload['uid'] = uid
    if (payload.parentAsGuardian) return await this.db.$transaction(async (prisma) => {
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
      const categoryData = await prisma.trainingCategory.findFirst({ where: { id: payload.trainingId } })
      if (!categoryData) throw new BadRequest("Data Kategori tidak ditemukan")
      return await prisma.member.update({ where: { id }, data: { courseCategoryId: payload.courseCategoryId,  totalCoursePrice: 2000000, totalCourses: 1, courseLevel: payload.courseLevel } })
    })
  }

  extendDataPembayaran = async (payload) => {
    const createdPayment = await this.paymentService.createPayment({ ...payload, paymentTotal: 2000000,  purpose: "Pendaftaran", status: "Tunda"})
    const { paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate, ...rest } = createdPayment
    return { paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate }
  }
}

export default memberService;  