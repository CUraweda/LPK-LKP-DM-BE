import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class membercertificateService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberCertificate.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberCertificate.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  count = async (query) => {
    const { date } = query
    const q = this.transformBrowseQuery(query);

    if (date) {
      let start_date = new Date(date)
      let end_date = new Date(date)
      start_date.setHours(0, 0, 0, 0);
      end_date.setHours(23, 59, 59, 999);

      console.log(start_date, end_date)

      q.where.createdAt = { gte: start_date, lte: end_date }
    }

    return await this.db.memberCertificate.count({ where: q.where });
  };

  findById = async (id) => {
    const data = await this.db.memberCertificate.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.memberCertificate.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.memberCertificate.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberCertificate.delete({ where: { id } });
    return data;
  };
}

export default membercertificateService;  
