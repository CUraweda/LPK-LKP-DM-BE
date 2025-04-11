import BaseController from "../../../../base/controller.base.js";
import { NotFound } from "../../../../exceptions/catch.execption.js";
import landingPageService from "./landingpage.service.js";

class landingPageController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new landingPageService();
  }

  //? BEGIN > HERO BANNER
  showHeroBanner = this.wrapper(async (req, res) => {
    const data = await this.#service.showHeroBanner(req.params.id);
    if (!data) throw new NotFound("Hero Banner tidak ditemukan");

    return this.ok(res, data, "Hero Banner berhasil didapatkan");
  });

  createHeroBanner = this.wrapper(async (req, res) => {
    const data = await this.#service.createHeroBanner(req.body);
    return this.created(res, data, "Hero Banner berhasil dibuat");
  });

  updateHeroBanner = this.wrapper(async (req, res) => {
    const data = await this.#service.updateHeroBanner(req.params.id, req.body);
    return this.ok(res, data, "Hero Banner berhasil diubah");
  });

  deleteHeroBanner = this.wrapper(async (req, res) => {
    await this.#service.deleteHeroBanner(req.params.id);
    return this.noContent(res, "Hero Banner berhasil dihapus");
  });
  //? END > HERO BANNER

  aboutUs = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  vision = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  mission = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  confidenceAchievement = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  training = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  team = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  studentCreation = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  testimonial = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  industry = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  faq = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  footer = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "landingPage berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "landingPage berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "landingPage berhasil dihapus");
  });
}

export default landingPageController;
