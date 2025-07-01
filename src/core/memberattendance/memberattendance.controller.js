import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import memberattendanceService from "./memberattendance.service.js";

class memberattendanceController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberattendanceService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak memberattendance berhasil didapatkan");
  });

  countAll = this.wrapper(async (req, res) => {
    const data = await this.#service.countAll();
    return this.ok(res, data, "Banyak memberattendance berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("memberattendance tidak ditemukan");

    return this.ok(res, data, "memberattendance berhasil didapatkan");
  });
  
  findRange = this.wrapper(async (req, res) => {
    const data = await this.#service.findRange(req.body);
    if (!data) throw new NotFound("memberattendance tidak ditemukan");

    return this.ok(res, data, "memberattendance berhasil didapatkan");
  });

  myRecap = this.wrapper(async (req, res) => {
    const data = await this.#service.myRecap(req.user, req.query);
    if (!data) throw new NotFound("memberattendance tidak ditemukan");

    return this.ok(res, data, "memberattendance berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "memberattendance berhasil dibuat");
  });

  attend = this.wrapper(async (req, res) => {
    if (!req.file) return this.BadRequest(res, "Mohon sertakan gambar presensi")
    req.body['attendanceImage'] = req.file.path
    const data = await this.#service.attend(req.user, req.body);
    return this.created(res, data, "memberattendance berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "memberattendance berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "memberattendance berhasil dihapus");
  });
}

export default memberattendanceController;
