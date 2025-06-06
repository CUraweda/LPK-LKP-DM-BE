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
    const data = await this.db.memberAttendance.findMany({ ...q });

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
      const createMember = await prisma.memberAttendance.create({ data: payload })
      if (!createMember) throw new BadRequest("Terjadi kesalahan saat membuat data member")
      const formattedAttendance = this.formatMemberAttendance(user.member.formattedAttendance, payload)
      await prisma.member.update({ where: { id: createMember.memberId }, data: { formattedAttendance } })
      return createMember;
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
