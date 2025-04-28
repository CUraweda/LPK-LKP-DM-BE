import BaseService from "../../../base/service.base.js";
import prisma from '../../../config/prisma.db.js';

class memberattendanceService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberattendance.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberattendance.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.memberattendance.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.memberattendance.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.memberattendance.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberattendance.delete({ where: { id } });
    return data;
  };
}

export default memberattendanceService;  
