import BaseController from "../../../base/controller.base.js";
import { NotFound } from "../../../exceptions/catch.execption.js";
import memberidentityService from "./memberidentity.service.js";

class memberidentityController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberidentityService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak memberidentity berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("memberidentity tidak ditemukan");

    return this.ok(res, data, "memberidentity berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "memberidentity berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "memberidentity berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "memberidentity berhasil dihapus");
  });
}

export default memberidentityController;
