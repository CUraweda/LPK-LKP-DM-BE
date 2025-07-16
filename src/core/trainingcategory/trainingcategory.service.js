import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";

class trainingCategoryService extends BaseService {
  constructor() {
    super(prisma);
  }

  formatUID = (payload) => {
    return `${payload['title'].split(" ").map(word => word[0]).join("")}-${payload['level']}`
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.trainingCategory.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.trainingCategory.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.trainingCategory.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const uid = this.formatUID(payload)
    const UIDAlreadyExist = await this.db.trainingCategory.findFirst({ where: { uid } })
    if (UIDAlreadyExist) throw new BadRequest("UID Telah Dipakai, mohon ganti data")
    payload['uid'] = uid
    const data = await this.db.trainingCategory.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const exist = await this.db.trainingCategory.findFirst({ where: { id } })
    if (!exist) throw new BadRequest("Data Kategori tidak ditemukan")
    if (payload['title'] || payload['level']) {
      payload['title'] = payload['title'] ? payload['title'] : exist.title
      payload['level'] = payload['level'] ? payload['level'] : exist.level
      const uid = this.formatUID(payload)
      const UIDAlreadyExist = await this.db.trainingCategory.findFirst({ where: { uid } })
      if (UIDAlreadyExist) throw new BadRequest("UID Telah Dipakai, mohon ganti data")
      payload['uid'] = uid
    }
    const data = await this.db.trainingCategory.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.trainingCategory.delete({ where: { id } });
    return data;
  };
}

export default trainingCategoryService;  
