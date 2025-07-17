import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import trainingService from "./training.service.js";
import fs from 'fs';
import path from 'path';

class trainingController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new trainingService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak training berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("training tidak ditemukan");

    return this.ok(res, data, "training berhasil didapatkan");
  });
  
  create = this.wrapper(async (req, res) => {
    const logoFile = req.files?.trainingImage?.[0];
    if (!logoFile) {
      throw new Error("Logo pelatihan wajib diunggah");
    }
    const payload = {
      ...req.body,
      trainingImage: `/uploads/training-images/${logoFile.filename}`,
    };
    const data = await this.#service.create(payload);
    return this.created(res, data, "training berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const id = Number(req.params.id);
    const imageFile = req.files?.trainingImage?.[0];

    const oldData = await this.#service.findById(id);
    if (!oldData) throw new Error("Pelatihan tidak ditemukan");

    const payload = { ...req.body };

    if (imageFile) {
      if (oldData.trainingImage) {
        const oldPath = path.join(process.cwd(), oldData.trainingImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      payload.trainingImage = `/uploads/company-logos/${imageFile.filename}`;
    }

    const data = await this.#service.update(id, payload);
    return this.ok(res, data, "Pelatihan berhasil diperbarui");
  });


  updateStatus = this.wrapper(async (req, res) => {
    const data = await this.#service.updateStatus(req.params.id, req.body.isActive);
    return this.ok(res, data,"training berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "training berhasil dihapus");
  });
}

export default trainingController;
