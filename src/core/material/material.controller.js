import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import materialService from "./material.service.js";


class materialController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new materialService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak material berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("material tidak ditemukan");

    return this.ok(res, data, "material berhasil didapatkan");
  });

  downloadPdf = this.wrapper(async (req, res) => {
    const id = Number(req.params.id);
    const { filePath, fileName } = await this.#service.downloadPdf(id);
    return res.download(filePath, fileName);
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body, req.files);
    return this.created(res, data, "Material berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const id = Number(req.params.id);
    const data = await this.#service.update(id, req.body, req.files);
    return this.ok(res, data, "Material berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const id = Number(req.params.id);
    await this.#service.delete(id);
    return this.noContent(res, "Material dan file berhasil dihapus");
  });

}

export default materialController;
