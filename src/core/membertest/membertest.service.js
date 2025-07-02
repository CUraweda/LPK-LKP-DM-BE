import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class membertestService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberTest.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberTest.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberTest.findUnique({ where: { id: convertId } });
    return data;
  };

  findByExam = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberTest.findMany({ where: { examId: convertId } });
    return data;
  };

  create = async (payload) => {
    const startTime = new Date()
    const payload_data = {
      ...payload,
      startTime
    }
    const data = await this.db.memberTest.create({ data: payload_data });
    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id)
    const finishedAt = new Date()
    const payload_data = {
      ...payload,
      finishedAt
    }
    const data = await this.db.memberTest.update({ where: { id: convertId }, data: payload_data });
    return data;
  };

  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberTest.delete({ where: { id: convertId } });
    return data;
  };
}

export default membertestService;  
