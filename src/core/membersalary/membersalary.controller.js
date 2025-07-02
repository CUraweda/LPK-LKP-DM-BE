import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import membersalaryService from "./membersalary.service.js";

class membersalaryController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new membersalaryService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak membersalary berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("membersalary tidak ditemukan");

    return this.ok(res, data, "membersalary berhasil didapatkan");
  });

  findByUser = this.wrapper(async (req, res) => {
    const data = await this.#service.findByUser(req.params.id);
    if (!data) throw new NotFound("membersalary tidak ditemukan");

    return this.ok(res, data, "membersalary berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "membersalary berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "membersalary berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "membersalary berhasil dihapus");
  });
}

export default membersalaryController;
