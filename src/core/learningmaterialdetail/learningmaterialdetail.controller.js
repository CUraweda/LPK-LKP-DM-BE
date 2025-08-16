import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import learningMaterialDetailService from "./learningmaterialdetail.service.js";

class learningMaterialDetailController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new learningMaterialDetailService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak learningMaterialDetail berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("learningMaterialDetail tidak ditemukan");

    return this.ok(res, data, "learningMaterialDetail berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "learningMaterialDetail berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "learningMaterialDetail berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "learningMaterialDetail berhasil dihapus");
  });
}

export default learningMaterialDetailController;
