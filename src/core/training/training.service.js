import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class trainingService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.training.findMany({ ...q,
    select: {
      id: true,
      title: true,
      description: true,
      trainingImage: true,
      type: true,
      totalParticipants: true,
      totalCourses: true,
      totalHours: true,
      targetTrainingHours: true,
      level: true,
      isActive: true,
    }});
    const type_R = data.filter(item => item.type === 'R').length;
    const type_P = data.filter(item => item.type === 'P').length;
    const total = data.length;

    const responseData = {
      type_R,
      type_P,
      total,
      items: data
    };

    if (query.paginate) {
      const countData = await this.db.training.count({ where: q.where });
      return this.paginate(responseData, countData, q);
    }

    return responseData;
  };

  findById = async (id) => {
    const intId = Number(id)
    const data = await this.db.training.findUnique({ where: { id: intId } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.training.create({ data: payload });
    return data;
  };
  
  update = async (id, payload) => {
    const existing = await this.db.training.findFirst({ where: { id } })
    const sanitizedPayload = {
      ...payload,
      isActive: typeof payload.isActive === 'string'
        ? payload.isActive === 'true'
        : payload.isActive,

      ...(payload.categoryId !== undefined && payload.categoryId !== null && {
        categoryId: parseInt(payload.categoryId),
      }),

      totalParticipants: payload.totalParticipants !== undefined
        ? Number(payload.totalParticipants)
        : existing.totalParticipants,

      totalCourses: payload.totalCourses !== undefined
        ? Number(payload.totalCourses)
        : existing.totalCourses,

      totalHours: payload.totalHours !== undefined
        ? Number(payload.totalHours)
        : existing.totalHours,

      targetTrainingHours: payload.targetTrainingHours !== undefined
        ? Number(payload.targetTrainingHours)
        : existing.targetTrainingHours,
    };

    const data = await this.db.training.update({
      where: { id },
      data: sanitizedPayload,
    });

    return data;
  };

  updateStatus = async(id, payload) => {
    const convertId = Number(id)
    const data = await this.db.training.update({
      where: { id: convertId },
      data: { isActive: payload }
    })
    return data;
  }

  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.training.delete({ where: { id: convertId } });
    return data;
  };
}

export default trainingService;  
