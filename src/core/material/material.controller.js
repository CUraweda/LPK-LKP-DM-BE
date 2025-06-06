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

  create = this.wrapper(async (req, res) => {
    console.log(req.files)
    const coverImage = req.files?.coverImage?.[0];
    const filePdf = req.files?.filePdf?.[0];

    if (!coverImage || !filePdf) {
      throw new Error('Gambar atau file PDF tidak ditemukan');
    }

    const payload = {
      ...req.body,
      coverImage: `/uploads/materials/${coverImage.filename}`,
      link: `/uploads/materials/${filePdf.filename}`,
      size: (filePdf.size / 1024).toFixed(2) + ' KB'
    };

    const data = await this.#service.create(payload);
    return this.created(res, data, "Material berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "material berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "material berhasil dihapus");
  });
}

export default materialController;
