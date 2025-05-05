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
          status: 'AVAILABLE', // Initial status is AVAILABLE for the first user
        },
      });
  
      // Step 2: Enroll the user into the newly created schedule
      const enrollment = await this.db.trainingEnrollment.create({
        data: {
          memberId: memberId,
          scheduleId: newSchedule.id,
          status: 'IN_PROGRESS', // Set status to IN_PROGRESS for the user
        },
      });
  
      // Step 3: After enrollment, change the schedule status to 'UNAVAILABLE' for other users
      await this.db.trainingSchedule.update({
        where: { id: newSchedule.id },
        data: { status: 'UNAVAILABLE' }, // Once a user takes the schedule, make it unavailable for others
      });
  
      // Return the new schedule and enrollment
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
