import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class curiculumDetailService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.curiculumDetail.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.curiculumDetail.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.curiculumDetail.findUnique({ where: { id: convertId } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.curiculumDetail.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id)
    const data = await this.db.curiculumDetail.update({ where: { id: convertId }, data: payload });
    return data;
  };

  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.curiculumDetail.delete({ where: { id: convertId } });
    return data;
  };
}

export default curiculumDetailService;  
