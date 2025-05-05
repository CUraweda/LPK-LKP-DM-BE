import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import trainingenrollmentService from "./trainingenrollment.service.js";

class trainingenrollmentController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new trainingenrollmentService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak trainingenrollment berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("trainingenrollment tidak ditemukan");

    return this.ok(res, data, "trainingenrollment berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "Jadwal berhasil dibooking");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "trainingenrollment berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "trainingenrollment berhasil dihapus");
  });
}

export default trainingenrollmentController;
