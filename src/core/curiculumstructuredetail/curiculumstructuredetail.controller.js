import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import curiculumStructureDetailService from "./curiculumstructuredetail.service.js";

class curiculumStructureDetailController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new curiculumStructureDetailService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak curiculumStructureDetail berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("curiculumStructureDetail tidak ditemukan");

    return this.ok(res, data, "curiculumStructureDetail berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "curiculumStructureDetail berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "curiculumStructureDetail berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "curiculumStructureDetail berhasil dihapus");
  });
}

export default curiculumStructureDetailController;
