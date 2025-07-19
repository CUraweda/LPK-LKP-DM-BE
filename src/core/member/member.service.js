import { memberState } from "@prisma/client";
import BaseService from "../../base/service.base.js";
import memberConstant from "../../config/member.js";
import prism from "../../config/prisma.db.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";
import paymentService from "../payment/payment.service.js";
import AuthenticationService from "../authentication/authentication.service.js";

class memberService extends BaseService {
  constructor() {
    super(prisma);
    this.authenticationService = new AuthenticationService()
    this.paymentService = new paymentService()
  }

  findAll = async (query) => {
    const { startDate, endDate, status } = query;
    const q = this.transformBrowseQuery(query);

    if (status) {
      switch (status) {
        case "Sedang Pelatihan":
          q.where.isGraduate = false
          break;
        case "Selesai Pelatihan":
          q.where.isGraduate = true
          break;
        default:
          break;
      }
    }
    if (startDate && endDate) {
      q.where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const data = await this.db.member.findMany({
      ...q,
      include: {
        User: true,
        identity: true,
      },
    });

    if (query.paginate) {
      const countData = await this.db.member.count({ where: q.where });
      return this.paginate(data, countData, q);
    }

    return data;
  };

  count = async (query) => {
    const q = this.transformBrowseQuery(query);
    const { date } = query

    if (date) {
      let start_date = new Date(date)
      let end_date = new Date(date)
      start_date.setHours(0, 0, 0, 0);
      end_date.setHours(23, 59, 59, 999);

      q.where.createdAt = { gte: start_date, lte: end_date }
    }

    const data = await this.db.member.count({
      ...q,
    });

    return data;
  };

  findActive = async (query) => {
    const q = this.transformBrowseQuery(query);
    q.where['isGraduate'] = false;

    const data = await this.db.member.findMany({
      ...q,
      include: {
        User: true,
        identity: true,
      },
    });

    if (query.paginate) {
      const countData = await this.db.member.count({ where: q.where });
      return this.paginate(data, countData, q);
    }

    return data;
  };

  findInactive = async (query) => {
    const q = this.transformBrowseQuery(query);
    q.where['isGraduate'] = true;

    const data = await this.db.member.findMany({
      ...q,
      include: {
        User: true,
        identity: true,
      },
    });

    if (query.paginate) {
      const countData = await this.db.member.count({ where: q.where });
      return this.paginate(data, countData, q);
    }

    return data;
  };

  validateRegistrationPayment = async (user) => {
    const data = await this.db.member.findFirst({ where: { id: user.member.id }, include: { registrationPayment: { include: { transaction: true } } } })
    const currentDate = new Date();
    if (data.registrationPaymentId || data?.registrationPayment?.transaction?.expiredDate << currentDate) {
      return {
        validPayment: true,
        paymentMethod: data.registrationPayment.transaction.paymentMethod,
        paymentTotal: data.registrationPayment.transaction.paymentTotal,
        qrisLink: data.registrationPayment.transaction.qrisLink,
        virtualAccountNo: data.registrationPayment.transaction.virtualAccountNo,
        expiredDate: data.registrationPayment.transaction.expiredDate,
      }
    } else {
      return { validPayment: false }
    }
  }

  countRecap = async () => {
    let start_date = new Date()
    let end_date = new Date()
    start_date.setHours(0, 0, 0, 0);
    end_date.setHours(23, 59, 59, 999);

    let recapData = { siswaBaru: 0, siswa: 0, totalSiswa: 0 }
    recapData.siswaBaru = await this.db.member.count({ where: { createdAt: { gte: start_date, lte: end_date }, isGraduate: false } })
    recapData.siswa = await this.db.member.count({ where: { isGraduate: false } })
    recapData.totalSiswa = await this.db.member.count()

    return recapData
  }

  findById = async (id) => {
    const data = await this.db.member.findUnique({ where: { id } });
    return data;
  };

  findDetail = async (id) => {
    const data = await this.db.member.findFirst({
      where: { id }, select: {
        id: true, name: true, phoneNumber: true, profileImage: true, trainingId: true,
        identity: true, parents: true
      }
    })
    return data
  }

  create = async (payload) => {
    const data = await this.db.member.create({ data: payload });
    return data;
  };

  patchVerified = async (id) => {
    const memberData = await this.db.member.findFirst({ where: { id }, select: { dataVerified: true } })
    if (!memberData) throw new BadRequest("Akun member tidak ditemukan")

    return await this.db.member.update({
      where: { id }, data: {
        dataVerified: !memberData.dataVerified,
        ...(memberData.dataVerified ? { verifiedAt: null } : { verifiedAt: new Date() })
      }
    });
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
    let id = payload.memberId
    if (payload['createNew']) {
      if (payload['email'] && payload['password']) {
        const data = await this.db.member.create()
        const user = await this.authenticationService.register(payload)
        id = data.id
        await this.db.user.update({ where: { id: user.user.id }, data: { memberId: id } })
        payload['memberId'] = data.id
        delete payload['createNew']
        delete payload['email']
        delete payload['password']
      } else throw new BadRequest("Mohon sertakan email dan password")
    } else delete payload['createNew']; delete payload['email']; delete payload['password']
    let exist = await this.db.member.findFirst({ where: { id } })
    if (!exist) exist = await this.db.member.create()

    return await this.db.$transaction(async (prisma) => {
      const { name, profileImage, phoneNumber, fromUpdateMe, ...data } = payload
      await prisma.memberIdentity.upsert({ where: { memberId: id }, create: data, update: data })
      await prisma.member.update({
        where: { id }, data: {
          name,
          ...(fromUpdateMe ? { memberState: memberConstant.memberState.Data_Ibu } : {}),
          profileImage, phoneNumber
        }
      })
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
    const { memberId, trainingId } = payload;

    return await this.db.$transaction(async (prisma) => {
      const trainingData = await prisma.training.update({
        where: { id: trainingId },
        data: { totalParticipants: { increment: 1 } },
      });

      if (!trainingData) throw new BadRequest("Data Pelatihan tidak ditemukan");

      const schedules = await prisma.trainingSchedule.findMany({
        where: { trainingId: trainingId },
        select: { id: true },
      });

      if (trainingData.type !== "R") {
        for (const schedule of schedules) {
          await prisma.trainingEnrollment.create({
            data: {
              memberId,
              scheduleId: schedule.id,
              status: "BOOKED",
            },
          });
        }
      }

      return prisma.member.update({
        where: { id: memberId },
        data: {
          trainingId: trainingData.id,
          ...(trainingData.type === "R"
            ? { memberState: memberConstant.memberState.Pembayaran }
            : {
              memberState: memberConstant.memberState.Selesai
            }),
        },
      });
    });
  };


  extendDataPembayaran = async (payload) => {
    payload['memberId'] = payload['memberId'] ? payload['memberId'] : payload['user'].member.id
    const createdPayment = await this.paymentService.createPayment({ ...payload, paymentTotal: 2000000, purpose: "Pendaftaran", status: "Tunda" })
    const { paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate, ...rest } = createdPayment
    return { paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate }
  }
}

export default memberService;  