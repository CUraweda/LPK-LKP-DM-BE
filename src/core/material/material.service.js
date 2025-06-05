import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class materialService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.material.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.material.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.material.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const convertId = Number(payload.trainingId);
    const data = await this.db.material.create({ 
      data: { ...payload,
      trainingId: convertId }
    });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.material.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.material.delete({ where: { id } });
    return data;
  };
}

export default materialService;  
