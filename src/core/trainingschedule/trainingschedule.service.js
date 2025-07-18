import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { verifyToken } from "../../helpers/jwt.helper.js";
import { addDays, addHours, startOfDay } from "date-fns";

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

  findByMember = async (query = {}, headers) => {
    const authHeader = headers?.authorization || headers?.Authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new Error('No authorization token found');
    }

    let decodedUser;
    try {
      decodedUser = verifyToken(token);
    } catch (err) {
      console.error("Invalid token:", err);
      throw new Error('Invalid or expired token');
    }

    const user = await this.db.user.findFirst({
      where: { id: decodedUser.userId },
      include: { member: true },
    });

    if (!user || !user.member) {
      throw new Error('User or associated member not found');
    }

    const memberId = user.member.id;

    const now = new Date();
    let startTimeFilter = {};

    if (query.startTime) {
      const parsedDate = new Date(query.startTime);
      if (!isNaN(parsedDate.getTime())) {
        const endDate = new Date(parsedDate);
        endDate.setDate(endDate.getDate() + 7);

        startTimeFilter = {
          startTime: {
            gte: parsedDate,
            lt: endDate,
          },
        };
      }
    }


    const schedules = await this.db.trainingSchedule.findMany({
      where: {
        AND: [
          {
            enrollments: {
              some: {
                memberId: memberId,
              },
            },
          },
          startTimeFilter,
        ],
      },
      include: {
        training: true,
        enrollments: {
          where: {
            memberId: memberId,
          },
          include: {
            member: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    const remainingSchedule = schedules.filter((schedule) => {
      return new Date(schedule.endTime) > now;
    }).length;

    return { schedules, remainingSchedule };
  };

  create = async (payload) => {
    try {
      const { trainingId, memberId, startTime, endTime, type } = payload;

      const training = await this.db.training.findFirst({
        where: { id: trainingId }
      });

      if (!training) {
        throw new Error("Training tidak ditemukan");
      }

      const resolvedEndTime = endTime
        ? new Date(endTime)
        : (() => {
            const calculated = new Date(startTime);
            const duration = training.targetTrainingHours ?? 1;
            calculated.setUTCHours(calculated.getUTCHours() + duration);
            return calculated;
          })();

      const booked = await this.db.trainingEnrollment.findFirst({
        where: {
          memberId,
          schedule: {
            trainingId,
            startTime: new Date(startTime),
            type
          }
        }
      });

      if (booked) {
        throw new Error("You already booked this schedule.");
      }

      const existingSchedule = await this.db.trainingSchedule.findFirst({
        where: {
          trainingId,
          startTime: new Date(startTime),
          type
        },
        include: { enrollments: true }
      });

      if (existingSchedule) {
        const enrollment = await this.db.trainingEnrollment.create({
          data: {
            memberId,
            scheduleId: existingSchedule.id,
            status: "BOOKED"
          }
        });

        return {
          schedule: existingSchedule,
          enrollment
        };
      }

      const newSchedule = await this.db.trainingSchedule.create({
        data: {
          trainingId,
          startTime: new Date(startTime),
          endTime: resolvedEndTime,
          type,
          enrollments: {
            create: {
              memberId,
              status: "BOOKED"
            }
          }
        },
        include: { enrollments: true }
      });

      return newSchedule;

    } catch (error) {
      console.error("Error creating schedule and enrollment:", error);
      throw new Error(error.message || "Failed to create schedule");
    }
  };

  pCreate = async (payload) => {
    const { trainingId, startTime, endTime } = payload;

    const training = await this.db.training.findFirst({
      where: { id: trainingId },
    });

    if (!training) {
      throw new Error("Training tidak ditemukan");
    }

    const resolvedEndTime = endTime
      ? new Date(endTime)
      : (() => {
          const calculated = new Date(startTime);
          const duration = training.targetTrainingHours ?? 1;
          calculated.setUTCHours(calculated.getUTCHours() + duration);
          return calculated;
        })();

    const data = await this.db.trainingSchedule.create({
      data: {
        trainingId,
        startTime: new Date(startTime),
        endTime: resolvedEndTime,
        description: payload.description ?? null,
        type: 'P',
      },
    });

    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id)
    if(payload.startTime){
      const existing = await this.db.trainingSchedule.findFirst({ where: { id: convertId }})
      const training = await this.db.training.findFirst({ where: { id: existing.trainingId }})
      const endTime = new Date(payload.startTime);
      endTime.setUTCHours(endTime.getUTCHours() + training.targetTrainingHours);
      const payload_data = {
        ...payload,
          endTime: endTime.toISOString(),
      }
      const data = await this.db.trainingSchedule.update({ where: { id: convertId }, data: payload_data });
      return data;
    } else {
      const data = await this.db.trainingSchedule.update({ where: { id: convertId }, data: payload });
      return data;
    }
  };

  delete = async (id) => {
    const scheduleId = Number(id)
    await this.db.trainingEnrollment.deleteMany({ where: { scheduleId } });
    const data = await this.db.trainingSchedule.delete({ where: { id: scheduleId }});
    return data;
  };
}

export default trainingscheduleService;  
