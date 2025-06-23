import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class trainingscheduleService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.trainingSchedule.findMany(
      { 
        ...q,
        include: {
          training: true,
          enrollments: true
        } 
      });

    if (query.paginate) {
      const countData = await this.db.trainingSchedule.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const intId = Number(id)
    const data = await this.db.trainingSchedule.findUnique({ where: { id: intId } });
    return data;
  };

  findByMember = async (id) => {
    const intId = Number(id);
    const data = await this.db.trainingSchedule.findMany({
      where: {
        enrollments: {
          some: {
            memberId: intId
          }
        }
      },
      include: {
        enrollments: true,
      }
    });
    return data;
  }

  create = async (payload) => {
    try {
      const { trainingId, memberId, startTime, type } = payload;
      const training = await this.db.training.findFirst({ where: { id: trainingId }})
      const endTime = new Date(startTime);
      endTime.setUTCHours(endTime.getUTCHours() + training.targetTrainingHours);
      
      const booked = await this.db.trainingEnrollment.findFirst({
        where: {
          memberId,
          schedule: {
            trainingId,
            startTime,
            type
          }
        }
      });
      if (booked) {
        throw new Error("You already booked this schedule.");
      }

      const existing = await this.db.trainingSchedule.findFirst({
        where: {
          trainingId,
          startTime,
          type
        },
        include: {
          enrollments: true
        }
      });

      if (existing) {
        const enrollment = await this.db.trainingEnrollment.create({
          data: {
            memberId,
            scheduleId: existing.id,
            status: "BOOKED"
          }
        });
        return {
          schedule: existing,
          enrollment
        };
      }

      const newSchedule = await this.db.trainingSchedule.create({
        data: {
          trainingId,
          startTime,
          endTime: endTime.toISOString(),
          type,
          enrollments: {
            create: {
              memberId,
              status: 'BOOKED'
            }
          }
        },
        include: { enrollments: true }
      });
      
      return newSchedule;

    } catch (error) {
      console.error("Error creating schedule and enrollment:", error);
      throw Error(error);
    }
  };

  update = async (id, payload) => {
    const data = await this.db.trainingSchedule.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const intId = Number(id)
    const data = await this.db.trainingSchedule.delete({ where: { id: intId } });
    return data;
  };
}

export default trainingscheduleService;  
