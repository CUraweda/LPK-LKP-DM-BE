import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import curiculumStructureService from "./curiculumstructure.service.js";

class curiculumStructureController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new curiculumStructureService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak curiculumStructure berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("curiculumStructure tidak ditemukan");

    return this.ok(res, data, "curiculumStructure berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "curiculumStructure berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "curiculumStructure berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "curiculumStructure berhasil dihapus");
  });
}

export default curiculumStructureController;
