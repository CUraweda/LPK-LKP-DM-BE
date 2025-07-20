import BaseController from "../../base/controller.base.js";
import { BadRequest, NotFound } from "../../exceptions/catch.execption.js";
import membercertificateService from "./membercertificate.service.js";
import { existsSync, createReadStream } from "fs"
import path from "path"

class membercertificateController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new membercertificateService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak membercertificate berhasil didapatkan");
  });

  findMe = this.wrapper(async (req, res) => {
    req.query['where'] = `memberId:${req.user.memberId}`
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak member berhasil didapatkan");
  });

  count = this.wrapper(async (req, res) => {
    const data = await this.#service.count(req.query);
    return this.ok(res, data, "Banyak membercertificate berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("membercertificate tidak ditemukan");

    return this.ok(res, data, "membercertificate berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    if (!req.file) throw new BadRequest("Mohon masukan pdf")
    req.body['imageLink'] = req.file.path
    req.body['imageSize'] = req.file.size
    const data = await this.#service.create(req.body);
    return this.created(res, data, "membercertificate berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    if (req.file) {
      req.body['imageLink'] = req.file.path
      req.body['imageSize'] = req.file.size
    }
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "membercertificate berhasil diperbarui");
  });

  download = this.wrapper(async (req, res) => {
    const certificateBody = await this.#service.findById(+req.params.id);
    if (!certificateBody) throw this.BadRequest(res, "Data tidak ditemukan")
    const filePath = certificateBody.imageLink
    if (!existsSync(filePath)) throw new NotFound("File dihapus atau tidak ditemukan")

    const filename = path.basename(filePath);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  })

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "membercertificate berhasil dihapus");
  });
}

export default membercertificateController;
