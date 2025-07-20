import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import fs from 'fs'
import path from 'path'

class trainingService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.training.findMany({ ...q,
      include: {
        curiculumStructure: { select: { name: true }}
      }
     });
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
    const data = await this.db.training.findUnique({ where: { id: intId },
    include: {
      curiculumStructure: true
    } });
    return data;
  };

  create = async (payload) => {
    const {
      title,
      description,
      trainingImage,
      type,
      level,
      isActive,
      structureId,
      targetTrainingHours
    } = payload;

    const structureDetails = await this.db.curiculumStructureDetail.findMany({
      where: {
        structureId: Number(structureId),
      },
      select: {
        id: true,
        hours: true,
      },
    });

    const totalCourses = structureDetails.length;
    const totalHours = structureDetails.reduce((sum, d) => sum + d.hours, 0);

    const data = await this.db.training.create({
      data: {
        title,
        description,
        trainingImage,
        type,
        level,
        isActive,
        structureId,
        totalCourses,
        totalHours,
        totalParticipants: 0,
        targetTrainingHours
      },
    });

    return data;
  };
  
  update = async (id, payload, imageFile) => {
    const existing = await this.db.training.findFirst({ where: { id } });
    if (!existing) throw new Error("Pelatihan tidak ditemukan");

    if (imageFile) {
      if (existing.trainingImage) {
        const oldPath = path.join(process.cwd(), existing.trainingImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      payload.trainingImage = `/uploads/company-logos/${imageFile.filename}`;
    }

    let totalCourses = existing.totalCourses;
    let totalHours = existing.totalHours;

    if (payload.structureId) {
      const structureDetails = await this.db.curiculumStructureDetail.findMany({
        where: {
          structureId: Number(payload.structureId),
        },
        select: {
          id: true,
          hours: true,
        },
      });

      totalCourses = structureDetails.length;
      totalHours = structureDetails.reduce((sum, d) => sum + d.hours, 0);
    }

    const data = await this.db.training.update({
      where: { id },
      data: {
        title: payload.title,
        description: payload.description,
        trainingImage: payload.trainingImage,
        type: payload.type,
        level: payload.level,
        isActive: typeof payload.isActive === 'string'
          ? payload.isActive === 'true'
          : payload.isActive,
        structureId: payload.structureId,
        totalCourses: payload.totalCourses !== undefined
          ? Number(payload.totalCourses)
          : existing.totalCourses,
        totalHours: payload.totalHours !== undefined
          ? Number(payload.totalHours)
          : existing.totalHours,
        totalParticipants: payload.totalParticipants !== undefined
          ? Number(payload.totalParticipants)
          : existing.totalParticipants,
        targetTrainingHours: payload.targetTrainingHours !== undefined
          ? Number(payload.targetTrainingHours)
          : existing.targetTrainingHours
      },
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
