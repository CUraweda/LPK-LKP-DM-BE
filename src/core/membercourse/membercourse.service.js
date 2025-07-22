import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";

class memberCourseService extends BaseService {
  constructor() {
    super(prisma);
  }

  formatUID = (memberId, traininigId) => {
    return `${memberId}|${traininigId}`
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
    payload['uid'] = this.formatUID(payload['memberId'], payload['trainingId'])
    const data = await this.db.memberCourse.upsert({ where: { uid: payload['uid'] }, create: payload, update: payload });
    return data;
  };

  update = async (id, payload) => {
    const exist = await this.db.memberCourse.findFirst({ where: { id } })
    if (!exist) throw new BadRequest("Data tidak ditemukan")

    if (payload['memberId'] || payload['trainingId']) payload['uid'] = this.formatUID((payload['memberId'] || exist.memberId), (payload['trainingId'] || exist.trainingId))
    const data = await this.db.memberCourse.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberCourse.delete({ where: { id } });
    return data;
  };
}

export default memberCourseService;  
