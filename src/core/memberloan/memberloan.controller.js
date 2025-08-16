import BaseController from "../../base/controller.base.js";
import { BadRequest, NotFound } from "../../exceptions/catch.execption.js";
import memberloanService from "./memberloan.service.js";

class memberloanController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberloanService();
  }

  findAll = this.wrapper(async (req, res) => {
    if(req.user.role.code == "SISWA") req.query['where'] = req.query['where'] ? req.query['where'] + `|memberId=${req.user.memberId}` : `memberId:${req.user.memberId}`
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak memberloan berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("memberloan tidak ditemukan");
    return this.ok(res, data, "memberloan berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "memberloan berhasil dibuat");
  });
  
  createTransaction = this.wrapper(async (req, res) => {
    if(!req.user?.memberId) throw new BadRequest("Anda belum masuk kedalam member")
    const data = await this.#service.generateTransaction(+req.params.id, { paymentMethod: req.body['paymentMethod'], memberId: req.user.memberId });
    return this.created(res, data, "memberloan berhasil dibuat");
  });

  generateLoan  = this.wrapper(async (req, res) => {
    req.body['user'] = req.user
    const data = await this.#service.generateLoan(req.body);
    return this.created(res, data, "memberloan berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "memberloan berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "memberloan berhasil dihapus");
  });
}

export default memberloanController;
