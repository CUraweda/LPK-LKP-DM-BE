import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

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
  
  update = async (id, payload) => {
    const {
      title,
      description,
      trainingImage,
      type,
      level,
      isActive,
      totalParticipants,
      targetTrainingHours,
      curiculumStructures
    } = payload;

    const existing = await this.db.training.findFirst({ where: { id } });
    if (!existing) throw new Error("Training tidak ditemukan");

    let totalCourses = existing.totalCourses;
    let totalHours = existing.totalHours;

    let structureIds = [];
    if (curiculumStructures?.create) {
      structureIds = curiculumStructures.create.map(item => item.curiculumStructure.connect.id);
      const structures = await this.db.curiculumStructure.findMany({
        where: { id: { in: structureIds } },
        select: { id: true, hours: true }
      });

      if (structures.length !== structureIds.length) {
        throw new Error("Beberapa curiculumStructure tidak ditemukan");
      }

      totalCourses = structures.length;
      totalHours = structures.reduce((sum, s) => sum + s.hours, 0);

      await this.db.trainingCuriculumStructure.deleteMany({
        where: { trainingId: id },
      });
    }

    const data = await this.db.training.update({
      where: { id },
      data: {
        title,
        description,
        trainingImage,
        type,
        level,
        isActive: typeof isActive === 'string' ? isActive === 'true' : isActive,
        totalCourses,
        totalHours,
        totalParticipants: totalParticipants !== undefined
          ? Number(totalParticipants)
          : existing.totalParticipants,
        targetTrainingHours: targetTrainingHours !== undefined
          ? Number(targetTrainingHours)
          : existing.targetTrainingHours,
        ...(structureIds.length > 0 && {
          curiculumStructures: {
            create: structureIds.map(id => ({
              curiculumStructure: {
                connect: { id },
              },
            })),
          }
        })
      },
      include: {
        curiculumStructures: true,
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
