import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class memberCourseService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberCourse.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberCourse.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.memberCourse.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.memberCourse.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.memberCourse.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberCourse.delete({ where: { id } });
    return data;
  };
}

export default memberCourseService;  
