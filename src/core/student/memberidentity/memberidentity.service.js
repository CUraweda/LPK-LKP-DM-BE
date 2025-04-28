import BaseService from "../../../base/service.base.js";
import prisma from '../../../config/prisma.db.js';

class memberidentityService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberidentity.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberidentity.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.memberidentity.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.memberidentity.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.memberidentity.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberidentity.delete({ where: { id } });
    return data;
  };
}

export default memberidentityService;  
