import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { NotFound } from "../../exceptions/catch.execption.js";

class memberParentService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberParent.findMany({ ...q });

    if (q.where && query.paginate) {
      const countData = await this.db.memberParent.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.memberParent.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.memberParent.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.memberParent.update({ where: { id }, data: payload });
    return data;
  };

  updateMe = async (memberId, payload) => {
    const existing = await this.db.memberParent.findFirst({
      where: {
        memberId,
        relation: payload.relation,
      },
    });

    if (!existing) {
      return await this.db.memberParent.create({
        data: {
          ...payload,
  uid: `${memberId}|${payload.relation}`,
          memberId,
        },
      });
    }

    return await this.db.memberParent.update({
      where: { id: existing.id },
      data: payload,
    });
  }; 

  delete = async (id) => {
    const data = await this.db.memberParent.delete({ where: { id } });
    return data;
  };
}

export default memberParentService;  
