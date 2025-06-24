import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import membertestService from "./membertest.service.js";

class membertestController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new membertestService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak membertest berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("membertest tidak ditemukan");

    return this.ok(res, data, "membertest berhasil didapatkan");
  });
  
  findByExam = this.wrapper(async (req, res) => {
    const data = await this.#service.findByExam(req.params.id);
    if (!data) throw new NotFound("membertest tidak ditemukan");

    return this.ok(res, data, "membertest berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "membertest berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "membertest berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "membertest berhasil dihapus");
  });
}

export default membertestController;
