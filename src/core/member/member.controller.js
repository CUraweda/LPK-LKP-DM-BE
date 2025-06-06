import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import memberService from "./member.service.js";

class memberController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak member berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("member tidak ditemukan");

    return this.ok(res, data, "member berhasil didapatkan");
  });

  findMe = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.user.member.id);
    if (!data) throw new NotFound("member tidak ditemukan");

    return this.ok(res, data, "member berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "member berhasil dibuat");
  });

extendDataSiswa = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? req.params.id : req.user.member.id
    if(!req.file) this.BadRequest(res, "Foto siswa harus disertakan")
    req.body["profileImage"] = req.file.path
    await this.#service.extendDataSiswa(req.body);
    return this.created(res, "Data Siswa berhasil ditambahkan");
  });
  
  extendDataIbu = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? req.params.id : req.user.member.id
    await this.#service.extendDataIbu(req.body);
    return this.created(res, "Data Ibu berhasil ditambahkan");
  });
  
  extendDataAyah = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? req.params.id : req.user.member.id
    await this.#service.extendDataAyah(req.body);
    return this.created(res, "Data Ayah berhasil ditambahkan");
  });
  
  extendDataWali  = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? req.params.id : req.user.member.id
    await this.#service.extendDataWali(req.body);
    return this.created(res, "Data Wali berhasil ditambahkan");
  });
  
  extendDataTraining  = this.wrapper(async (req, res) => {
    req.body['memberId'] = (req.user.role.code == "ADMIN") ? req.params.id : req.user.member.id
    await this.#service.extendDataTraining(req.body);
    return this.created(res, "Data Kursus berhasil ditambahkan");
  });
  
  extendDataPembayaran  = this.wrapper(async (req, res) => {
    req.body['user'] = req.user
    const data = await this.#service.extendDataPembayaran(req.body);
    return this.created(res, data, "Data Pembayaran berhasil ditambahkan");
  });

  patchVerified = this.wrapper(async (req, res) => {
    const data = await this.#service.patchVerified(+req.params.id, req.body);
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
