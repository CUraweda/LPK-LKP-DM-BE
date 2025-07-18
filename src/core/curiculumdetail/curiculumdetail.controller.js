import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import curiculumDetailService from "./curiculumdetail.service.js";

class curiculumDetailController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new curiculumDetailService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak curiculumDetail berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("curiculumDetail tidak ditemukan");

    return this.ok(res, data, "curiculumDetail berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "curiculumDetail berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "curiculumDetail berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "curiculumDetail berhasil dihapus");
  });
}

export default curiculumDetailController;
