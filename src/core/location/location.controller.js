import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import locationService from "./location.service.js";

class locationController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new locationService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak location berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("location tidak ditemukan");

    return this.ok(res, data, "location berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "location berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "location berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "location berhasil dihapus");
  });
}

export default locationController;
