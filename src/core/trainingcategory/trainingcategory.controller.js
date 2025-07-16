import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import trainingCategoryService from "./trainingcategory.service.js";

class trainingCategoryController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new trainingCategoryService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak Kategori Training berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("Kategori Training tidak ditemukan");

    return this.ok(res, data, "Kategori Training berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    if(req.file) req.body['image'] = req.file.path
    const data = await this.#service.create(req.body);
    return this.created(res, data, "Kategori Training berhasil dibuat");
  });
  
  update = this.wrapper(async (req, res) => {
    if(req.file) req.body['image'] = req.file.path
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "Kategori Training berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "Kategori Training berhasil dihapus");
  });
}

export default trainingCategoryController;
