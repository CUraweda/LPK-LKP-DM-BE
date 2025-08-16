import path from "path";
import fs from "fs"
import BaseController from "../../base/controller.base.js";
import { BadRequest, NotFound } from "../../exceptions/catch.execption.js";
import memberService from "./member.service.js";

class memberController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberService();
  }

  findAll = this.wrapper(async (req, res) => {
    req.query['hideAdmin'] = req.query['hideAdmin'] ? req.query['hideAdmin'] : "1"
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak member berhasil didapatkan");
  });

  findActive = this.wrapper(async (req, res) => {
    const data = await this.#service.findActive(req.query);
    return this.ok(res, data, "Banyak member berhasil didapatkan");
  });

  findInactive = this.wrapper(async (req, res) => {
    const data = await this.#service.findInactive(req.query);
    return this.ok(res, data, "Banyak member berhasil didapatkan");
  });

  findGraduated = this.wrapper(async (req, res) => {
    const data = await this.#service.findGraduated(req.query);
    return this.ok(res, data, "Banyak member berhasil didapatkan");
  });

  // countRecap = this.wrapper(async (req, res) => {
  //   const data = await this.#service.findGraduated(req.query);
  //   return this.ok(res, data, "Banyak member berhasil didapatkan");
  // });

  validateRegistrationPayment = this.wrapper(async (req, res) => {
    const data = await this.#service.validateRegistrationPayment(req.user);
    return this.ok(res, data, "Validasi Pembayaran Berhasil Dikirimkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("member tidak ditemukan");

    return this.ok(res, data, "member berhasil didapatkan");
  });

  findMe = this.wrapper(async (req, res) => {
    const data = await this.#service.findDetail(req.user.member.id);
    if (!data) throw new NotFound("member tidak ditemukan");

    return this.ok(res, data, "member berhasil didapatkan");
  });

  findState = this.wrapper(async (req, res) => {
    const data = await this.#service.findState(req.user.member.id);
    if (!data) throw new NotFound("member tidak ditemukan");

    return this.ok(res, data, "member berhasil didapatkan");
  });

  showDetail = this.wrapper(async (req, res) => {
    if (req.user.role.code == "SISWA") req.params.id = req.user.member.id
    const data = await this.#service.findDetail(+req.params.id);
    if (!data) throw new NotFound("member tidak ditemukan");

    return this.ok(res, data, "member berhasil didapatkan");
  });

  count = this.wrapper(async (req, res) => {
    const data = await this.#service.count(req.query);
    return this.ok(res, data, "Total Member berhasil didapatkan");
  });

  countRecap = this.wrapper(async (req, res) => {
    const data = await this.#service.countRecap();
    return this.ok(res, data, "Total Member berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "member berhasil dibuat");
  });

  finishTraining = this.wrapper(async (req, res) => {
    const data = await this.#service.finishTraining(+req.params.id);
    return this.created(res, data, "member berhasil dibuat");
  });

  downloadTemplate = this.wrapper(async (req, res) => {
    // try {
      const relPath = "/public/file/Template Import Alumni.xlsx"
      const ext = path.extname(relPath).toLowerCase();

      const baseDir = path.resolve('public');
      const fullPath = path.join(baseDir, relPath.replace(/^\/?public\/?/, ''));
      if (!fullPath.startsWith(baseDir)) throw new BadRequest("Denied")
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) throw new NotFound("File tidak ditemukan")

      const filename = path.basename(fullPath);
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
    // } catch (err) {
    //   throw new BadRequest("Template tidak dapat didownload")
    // }
  });

  extendDataSiswa = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? +req.params.id : req.user.member.id
    if (!(req.body['fromUpdateMe'] || req.params.id)) {
      if (!req.files['profilePict']) throw new BadRequest("Foto siswa harus disertakan");
      if (!req.files['ktpFile']) throw new BadRequest("Foto ktp harus disertakan");
    }
    if (req.files['profileImage']) req.body['profilePict'] = req.files['profilePict'][0].path
    if (req.files['ktpFile']) req.body['ktpFile'] = req.files['ktpFile'][0].path
    await this.#service.extendDataSiswa(req.body);
    return this.created(res, { memberId: req.body['memberId'] }, "Data Siswa berhasil ditambahkan");
  });

  extendDataIbu = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? +req.params.id : req.user.member.id
    await this.#service.extendDataIbu(req.body);
    return this.created(res, "Data Ibu berhasil ditambahkan");
  });

  extendDataAyah = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? +req.params.id : req.user.member.id
    await this.#service.extendDataAyah(req.body);
    return this.created(res, "Data Ayah berhasil ditambahkan");
  });

  extendDataWali = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? +req.params.id : req.user.member.id
    await this.#service.extendDataWali(req.body);
    return this.created(res, "Data Wali berhasil ditambahkan");
  });

  extendDataTraining = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? +req.params.id : req.user.member.id
    const data = await this.#service.extendDataTraining(req.body);
    return this.created(res, {
      memberState: data['memberState']
    }, "Data Kursus berhasil ditambahkan");
  });

  extendDataPembayaran = this.wrapper(async (req, res) => {
    req.body['user'] = req.user
    if (req.params.id) req.body['memberId'] = +req.params.id
    const data = await this.#service.extendDataPembayaran(req.body);
    return this.created(res, data, "Data Pembayaran berhasil ditambahkan");
  });

  patchVerified = this.wrapper(async (req, res) => {
    const data = await this.#service.patchVerified(+req.params.id);
    return this.ok(res, data, "perubahan berhasil diterapkan");
  });

  importAlumni = this.wrapper(async (req, res) => {
    if (!req.files['file']) throw new BadRequest("Sertakan excel untuk data alumni ")
    req.body['file'] = req.files['file'][0].path
    const data = await this.#service.importAlumni(req.body);
    return this.ok(res, data, "perubahan berhasil diterapkan");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "member berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "member berhasil dihapus");
  });
}

export default memberController;