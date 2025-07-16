import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { addDays, addHours, startOfDay } from "date-fns";
import { Prisma } from "@prisma/client";

class refScheduleService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.refSchedule.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.refSchedule.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.refSchedule.findUnique({ where: { id:convertId } });
    return data;
  };

  create = async (payload) => {
    const { trainingId, dayOfWeek, startHour, type, description = null } = payload;

    const training = await this.db.training.findUnique({ where: { id: trainingId } });

    let endHour = (startHour + training.targetTrainingHours) % 24;
    if (endHour === startHour) endHour = (startHour + 1) % 24;

    try {
      return await this.db.refSchedule.create({
        data: { trainingId, dayOfWeek, startHour, endHour, type, description },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Error(
          "Ref-schedule dengan trainingId, dayOfWeek, startHour, dan type tersebut sudah ada"
        );
      }
      throw new Error(err.message);
    }
  }

  update = async (id, payload) => {
    const convertId = Number(id)
    const data = await this.db.refSchedule.update({ where: { id: convertId }, data: payload });
    return data;
  };
  
  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.refSchedule.delete({ where: { id: convertId } });
    return data;
  };
}

export default refScheduleService;  
