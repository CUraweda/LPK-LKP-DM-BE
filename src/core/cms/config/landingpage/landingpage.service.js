import BaseService from "../../../../base/service.base.js";
import prisma from '../../../../config/prisma.db.js';

class landingPageService extends BaseService {
  constructor() {
    super(prisma);
  }

  //? BEGIN > HERO BANNER
  showHeroBanner = async (id) => {
    const data = await this.db.configHeroBanners.findUnique({ where: { id: parseInt(id) } });
    return data;
  };

  createHeroBanner = async (payload) => {
    const data = await this.db.configHeroBanners.create({ data: payload });
    return data;
  };

  updateHeroBanner = async (id, payload) => {
    const data = await this.db.configHeroBanners.update({
      where: { id: parseInt(id) },
      data: payload
    });
    return data;
  };

  deleteHeroBanner = async (id) => {
    const data = await this.db.configHeroBanners.delete({ where: { id: parseInt(id) } });
    return data;
  };
  //? END > HERO BANNER

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
}

export default landingPageService;
