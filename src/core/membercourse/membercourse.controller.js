import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import membercourseService from "./membercourse.service.js";

class membercourseController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new membercourseService();
  }

  findAll = this.wrapper(async (req, res) => {
    if(req.user.role.code == "SISWA") req.query['where'] = `memberId:${req.user.memberId}`
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak membercourse berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("membercourse tidak ditemukan");

    return this.ok(res, data, "membercourse berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "membercourse berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "membercourse berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "membercourse berhasil dihapus");
  });
}

export default membercourseController;
