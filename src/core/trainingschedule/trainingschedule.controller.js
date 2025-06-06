import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import trainingscheduleService from "./trainingschedule.service.js";

class trainingscheduleController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new trainingscheduleService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak trainingschedule berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("trainingschedule tidak ditemukan");

    return this.ok(res, data, "trainingschedule berhasil didapatkan");
  });
  
  findByMember = this.wrapper(async (req, res) => {
    const data = await this.#service.findByMember(req.params.id);
    if (!data) throw new NotFound("trainingschedule tidak ditemukan");

    return this.ok(res, data, "trainingschedule berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "trainingschedule berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "trainingschedule berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "trainingschedule berhasil dihapus");
  });
}

export default trainingscheduleController;
