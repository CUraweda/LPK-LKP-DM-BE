import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";

class facilitatorattendanceService extends BaseService {
  constructor() {
    super(prisma);
  }

  formatUID = (payload) => {
    const { facilitatorId, typeSchedule } = payload
    const [year, month, day] = new Date().toISOString().split("T")[0].split("-")
    return `${facilitatorId}${day}${month}${year}${typeSchedule}`
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.facilitatorAttendance.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.facilitatorAttendance.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.facilitatorAttendance.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    payload['UID'] = this.formatUID(payload)
    const data = await this.db.facilitatorAttendance.create({ data: payload });
    return data;
  };

  attend = async (payload) => {
    const { facilitatorId } = payload
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const alrCreated = await this.db.facilitatorAttendance.count({
      where: {
        facilitatorId, createdAt: {
          gte: startDate, lte: new Date()
        }
      }
    })
    if (alrCreated > 1) throw new BadRequest("Kamu sudah melakukan absen masuk dan keluar")
    payload['typeSchedule'] = alrCreated == 0 ? "IN" : "OUT"
    payload['UID'] = this.formatUID(payload)
    const data = await this.db.facilitatorAttendance.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const exist = await this.db.facilitatorAttendance.findFirst({ where: { id } })
    if (!exist) throw new BadRequest("Data tidak ditemukan")
    if (payload['facilitatorId'] || payload['typeSchedule']) payload['UID'] = this.formatUID({ facilitatorId: payload['facilitatorId'] || exist.facilitatorId, typeSchedule: payload['typeSchedule'] || exist.typeSchedule })
    return await this.db.facilitatorAttendance.update({ where: { id }, data: payload });
  };

  delete = async (id) => {
    const data = await this.db.facilitatorAttendance.delete({ where: { id } });
    return data;
  };
}

export default facilitatorattendanceService;  
