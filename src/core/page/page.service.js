import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class pageService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.page.findMany({ ...q, orderBy: { uid: 'asc' } });

    if (query.paginate) {
      const countData = await this.db.page.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.page.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const sectionNumber = await this.db.page.count({ where: { pageID: payload.pageID } })
    payload['uid'] = `${payload.pageID}_${sectionNumber + 1}`
    const data = await this.db.page.create({ data: payload });
    return data;
  };
  
  update = async (id, payload) => {
    const previousData = await this.db.page.findFirst({ where: { id } })
    if(payload.pageID != previousData.pageID){
      const sectionNumber = await this.db.page.count({ where: { pageID: payload.pageID } })
      payload['uid'] = `${payload.pageID}_${sectionNumber + 1}`
    }
    const data = await this.db.page.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.page.delete({ where: { id } });
    return data;
  };
}

export default pageService;  
