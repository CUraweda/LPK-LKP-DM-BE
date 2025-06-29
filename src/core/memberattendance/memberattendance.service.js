import { cp } from "fs";
import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";

class memberattendanceService extends BaseService {
  constructor() {
    super(prisma);
  }


  formatMemberAttendance = (oldFormat, newData = { type: "H" }) => {
    let index = 3
    switch (newData.type) {
      case "A": index = 0; break;
      case "I": index = 1; break;
      case "S": index = 2; break;
      default: index = 3; break;
    }
    let formatedSplit = oldFormat.split("|")
    formatedSplit[index] = +formatedSplit[index] + 1
    return formatedSplit.join("|")
  }
  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberAttendance.findMany({ ...q, orderBy: { rawDate: "desc" }   });

    if (query.paginate) {
      const countData = await this.db.memberAttendance.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.memberAttendance.findUnique({ where: { id } });
    return data;
  };

  myRecap = async (user, filter) => {
    let { iteration } = filter
    let start_date = new Date()
    let end_date = new Date()

    switch (iteration) {
      case "week":
        const dayOfWeek = start_date.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        start_date.setDate(start_date.getDate() + diffToMonday);
        start_date.setHours(0, 0, 0, 0);
        end_date = new Date(start_date);
        end_date.setDate(start_date.getDate() + 6);
        end_date.setHours(23, 59, 59, 999);
        break;

      case "month":
        start_date.setDate(1);
        start_date.setHours(0, 0, 0, 0);
        end_date = new Date(start_date);
        end_date.setMonth(start_date.getMonth() + 1);
        end_date.setDate(0);
        end_date.setHours(23, 59, 59, 999);
        break;
      case "year":
        start_date = new Date(start_date.getFullYear(), 0, 1);
        start_date.setHours(0, 0, 0, 0);

        end_date = new Date(start_date.getFullYear(), 11, 31);
        end_date.setHours(23, 59, 59, 999);
        break;
      default:
        start_date.setHours(0, 0, 0, 0);
        end_date.setHours(23, 59, 59, 999);
        break
    }

    const dataFilter = { H: 0, I: 0, S: 0, A: 0 };
    await this.db.memberAttendance.findMany({
      where: {
        memberId: user.member.id,
        rawDate: { gte: start_date, lte: end_date }
      }
    }).then((dt) =>
      dt.forEach((data) => { dataFilter[data.type]++ })
    )

    const dataAll = { H: 0, I: 0, S: 0, A: 0 }
    await this.db.memberAttendance.findMany({
      where: {
        memberId: user.member.id,
      }
    }).then((dt) =>
      dt.forEach((data) => { dataAll[data.type]++ })
    )
    return { date: { start_date, end_date }, dataFilter, dataAll }
  }

  create = async (payload) => {
    payload.rawDate = new Date().toISOString()
    payload.date = payload.rawDate.split("T")[0]
    payload.time = payload.rawDate.split("T")[1]
    const member = await this.db.member.findFirst({ where: { id: payload.memberId } })
    if (!member) throw new BadRequest("Relasi Member tidak ditemukan")

    await this.db.$transaction(async (prisma) => {
      const createMember = await prisma.memberAttendance.create({ data: payload })
      if (!createMember) throw new BadRequest("Terjadi kesalahan saat membuat data member")
      await prisma.member.update({ where: { id: payload.memberId }, data: { formattedAttendance: this.formatMemberAttendance(member.formattedAttendance, payload) } })
      return createMember;
    });
  };

  attend = async (user, payload) => {
    payload.memberId = user.member.id
    payload.rawDate = new Date().toISOString()
    payload.date = payload.rawDate.split("T")[0]
    payload.time = payload.rawDate.split("T")[1]

    await this.db.$transaction(async (prisma) => {
      const createAttend = await prisma.memberAttendance.create({ data: payload })
      if (!createAttend) throw new BadRequest("Terjadi kesalahan saat membuat data member")
      const formattedAttendance = this.formatMemberAttendance(user.member.formattedAttendance, payload)
      await prisma.member.update({ where: { id: createAttend.memberId }, data: { formattedAttendance } })
      return createAttend;
    });
  };

  update = async (id, payload) => {
    const data = await this.db.memberAttendance.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberAttendance.delete({ where: { id } });
    return data;
  };
}

export default memberattendanceService;  
