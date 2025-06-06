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
      const { trainingId, memberId, startTime, endTime, type } = payload;
  
      // Step 1: Create the new schedule
      const newSchedule = await this.db.trainingSchedule.create({
        data: {
          trainingId: trainingId,
          startTime: startTime,
          endTime: endTime,
          type: type,
          status: 'AVAILABLE',
        },
      });
  
      const enrollment = await this.db.trainingEnrollment.create({
        data: {
          memberId: memberId,
          scheduleId: newSchedule.id,
          status: 'BOOKED',
        },
      });
  
      await this.db.trainingSchedule.update({
        where: { id: newSchedule.id },
        data: { status: 'UNAVAILABLE' },
      });
  
      const data = {
        newSchedule, enrollment
      }

      return data;
    } catch (error) {
      console.error("Error creating schedule and enrollment:", error);
      throw Error(error)
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
