import BaseController from "../../../base/controller.base.js";
import { NotFound } from "../../../exceptions/catch.execption.js";
import membercertificateService from "./membercertificate.service.js";

class membercertificateController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new membercertificateService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak membercertificate berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("membercertificate tidak ditemukan");

    return this.ok(res, data, "membercertificate berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "membercertificate berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "membercertificate berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "membercertificate berhasil dihapus");
  });
}

export default membercertificateController;
