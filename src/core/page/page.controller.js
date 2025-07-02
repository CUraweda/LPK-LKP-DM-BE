import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import pageService from "./page.service.js";

class pageController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new pageService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak page berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("page tidak ditemukan");

    return this.ok(res, data, "page berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    if (req.file) req.body['file'] = req.file.path
    const data = await this.#service.create(req.body);
    return this.created(res, data, "page berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    if (req.file) req.body['file'] = req.file.path
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "page berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "page berhasil dihapus");
  });
}

export default pageController;
