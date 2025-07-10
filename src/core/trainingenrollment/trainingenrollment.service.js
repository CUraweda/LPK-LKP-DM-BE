import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class trainingenrollmentService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.trainingEnrollment.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.trainingEnrollment.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.trainingEnrollment.findUnique({ where: { id: convertId } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.trainingEnrollment.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id);
    const enrollment = await this.db.trainingEnrollment.findUnique({
      where: { id: convertId },
      include: {
        schedule: true,
        member: true,
      },
    });

    if (!enrollment) throw new Error("Enrollment not found");
    const updated = await this.db.trainingEnrollment.update({
      where: { id: convertId },
      data: payload,
    });

    if (payload.status === "COMPLETED") {
      const { startTime, endTime } = enrollment.schedule;
      const durationMs = new Date(endTime) - new Date(startTime);
      const durationHours = durationMs / (1000 * 60 * 60);

      await this.db.member.update({
        where: { id: enrollment.memberId },
        data: {
          totalCourseHours: {
            increment: durationHours,
          },
        },
      });
    }

    return updated;
  };

  
  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.trainingEnrollment.delete({ where: { id: convertId } });
    return data;
  };
}

export default trainingenrollmentService;  
