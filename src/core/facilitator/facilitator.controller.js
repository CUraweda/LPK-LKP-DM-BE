import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import facilitatorService from "./facilitator.service.js";

class facilitatorController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new facilitatorService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak facilitator berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("facilitator tidak ditemukan");

    return this.ok(res, data, "facilitator berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "facilitator berhasil dibuat");
  });

  generateOne = this.wrapper(async (req, res) => {
    const data = await this.#service.generateOne(req.body);
    return this.created(res, data, "facilitator berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "facilitator berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "facilitator berhasil dihapus");
  });
}

export default facilitatorController;
