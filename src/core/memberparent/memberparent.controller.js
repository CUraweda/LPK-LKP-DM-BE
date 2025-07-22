import BaseController from "../../base/controller.base.js";
import { BadRequest, NotFound } from "../../exceptions/catch.execption.js";
import memberparentService from "./memberparent.service.js";

class memberparentController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new memberparentService();
  }

  findAll = this.wrapper(async (req, res) => {
    if(req.user.role.code == "SISWA") req.query['where'] = `memberId:${req.user.memberId}`
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak memberparent berhasil didapatkan");
  });
  
  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("memberparent tidak ditemukan");

    return this.ok(res, data, "memberparent berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "memberparent berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "memberparent berhasil diperbarui");
  });

  updateMe = this.wrapper(async (req, res) => {
    if(!req.user.memberId) throw new BadRequest("Akun tidak terhubung dengan member")
    const data = await this.#service.updateMe(req.user.memberId, req.body);
    return this.ok(res, data, "memberparent berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "memberparent berhasil dihapus");
  });
}

export default memberparentController;
