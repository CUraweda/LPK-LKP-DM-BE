import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class landingPageService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.landingPage.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.landingPage.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.landingPage.findUnique({ where: { id } });
    return data;
  };

  heroBanner = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  aboutUs = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  vision = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  mission = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  confidenceAchievement = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  training = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  team = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  studentCreation = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  testimonial = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  industry = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  faq = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  footer = async (payload) => {
    const data = await this.db.landingPage.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.landingPage.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.landingPage.delete({ where: { id } });
    return data;
  };
}

export default landingPageService;
