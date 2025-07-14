import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import memberworkService from "./memberwork.service.js";
import fs from 'fs';
import path from 'path';

class memberworkController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberworkService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak memberwork berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("memberwork tidak ditemukan");

    return this.ok(res, data, "memberwork berhasil didapatkan");
  });
  
  findByUser = this.wrapper(async (req, res) => {
    const data = await this.#service.findByUser(req.params.id);
    if (!data) throw new NotFound("training tidak ditemukan");

    return this.ok(res, data, "training berhasil didapatkan");
  });


  create = this.wrapper(async (req, res) => {
    const logoFile = req.files?.companyLogo?.[0];
    // if (!logoFile) throw new Error("Logo perusahaan wajib diunggah");

    const payload = {
      ...req.body,
      ...(logoFile && { companyLogo: `/uploads/company-logos/${logoFile.filename}` }),
    };

    const data = await this.#service.create(payload);
    return this.created(res, data, "MemberWork berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const id = Number(req.params.id);
    const logoFile = req.files?.companyLogo?.[0];

    const oldData = await this.#service.findById(id);
    if (!oldData) throw new Error("Data pekerjaan tidak ditemukan");

    const payload = {
      ...req.body,
    };

    if (logoFile) {
      if (oldData.companyLogo) {
        const oldPath = path.join(process.cwd(), oldData.companyLogo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      payload.companyLogo = `/uploads/company-logos/${logoFile.filename}`;
    }

    const data = await this.#service.update(id, payload);
    return this.ok(res, data, "MemberWork berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "memberwork berhasil dihapus");
  });
}

export default memberworkController;
