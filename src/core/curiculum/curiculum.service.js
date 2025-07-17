import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class curiculumService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.curiculum.findMany({
      ...q,
      include: {curiculumStructure: true}
    });

    if (query.paginate) {
      const countData = await this.db.curiculum.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.curiculum.findUnique({ 
      where: { id: convertId },
      include: { curiculumStructure: true} });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.curiculum.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id)
    const data = await this.db.curiculum.update({ where: { id: convertId }, data: payload });
    return data;
  };

  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.curiculum.delete({ where: { id: convertId } });
    return data;
  };
}

export default curiculumService;  
