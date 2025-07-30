import BaseController from "../../base/controller.base.js";
import { BadRequest, NotFound } from "../../exceptions/catch.execption.js";
import facilitatorattendanceService from "./facilitatorattendance.service.js";

class facilitatorattendanceController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new facilitatorattendanceService();
  }

  findAll = this.wrapper(async (req, res) => {
    if(!req.user?.role?.code) throw new BadRequest("Anda belum ")
    if (req.user.role.code == "INSTRUKTUR" || req.user.role.code == "PENGURUS") req.query['where'] = req.query['where'] ? req.query['where'] + `|facilitatorId:${req.user.Facilitator.id}` : `facilitatorId:${req.user.Facilitator.id}`
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak facilitatorattendance berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("facilitatorattendance tidak ditemukan");

    return this.ok(res, data, "facilitatorattendance berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    if (!req.file) throw new this.BadRequest("Mohon sertakan bukti gambar ")
    req.body['attendanceImage'] = req.file.path
    const data = await this.#service.create(req.body);
    return this.created(res, data, "facilitatorattendance berhasil dibuat");
  });

  attend = this.wrapper(async (req, res) => {
    if (!req.file) throw new BadRequest("Mohon sertakan bukti gambar ")
    if (!req.user.Facilitator) throw new BadRequest("Anda bukan insepktur/pengurus ")
    req.body['attendanceImage'] = req.file.path
    req.body['facilitatorId'] = req.user.Facilitator.id
    const data = await this.#service.attend(req.body);
    return this.created(res, data, "facilitatorattendance berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    if (req.file) req.body['attendanceImage'] = req.file.path
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "facilitatorattendance berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "facilitatorattendance berhasil dihapus");
  });
}

export default facilitatorattendanceController;
