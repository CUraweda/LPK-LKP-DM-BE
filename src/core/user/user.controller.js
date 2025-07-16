import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import userService from "./user.service.js";

class userController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new userService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak user berhasil didapatkan");
  });

  count = this.wrapper(async (req, res) => {
    const data = await this.#service.count(req.query);
    return this.ok(res, data, "Banyak user berhasil didapatkan");
  });

  findByName = this.wrapper(async (req, res) => {
    const data = await this.#service.findByName(req.query.search);
    return this.ok(res, data, "User berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("user tidak ditemukan");

    return this.ok(res, data, "user berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "user berhasil dibuat");
  });

  createAdmin = this.wrapper(async (req, res) => {
    if (!req.file) throw this.BadRequest(res, "Mohon sertakan foto profil")
    req.body['profileImage'] = req.file.path
    const data = await this.#service.createAdmin(req.body);
    return this.created(res, data, "user berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "user berhasil diperbarui");
  });

  updateAdmin = this.wrapper(async (req, res) => {
    if (req.file) req.body['profileImage'] = req.file.path
    const data = await this.#service.updateAdmin(+req.params.id, req.body);
    return this.ok(res, data, "user berhasil diperbarui");
  });

delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "user berhasil dihapus");
  });
}

export default userController;
