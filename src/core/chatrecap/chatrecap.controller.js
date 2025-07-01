import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import chatrecapService from "./chatrecap.service.js";

class chatrecapController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new chatrecapService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = {
      totalUnread: await this.#service.db.chatRecap.count({ where: { unreadedMessage: { gte: 1 } } }),
      history: await this.#service.findAll(req.query)
    };
    return this.ok(res, data, "Banyak chatrecap berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("chatrecap tidak ditemukan");

    return this.ok(res, data, "chatrecap berhasil didapatkan");
  });
  
  findAllNew = this.wrapper(async (req, res) => {
    const data = await this.#service.findNewChat();
    if (!data) throw new NotFound("chatrecap tidak ditemukan");
  
    return this.ok(res, data, "chatrecap berhasil didapatkan");
  })

  findMessages = this.wrapper(async (req, res) => {
    const id = req.user.role.code == "SISWA" ? req.user.id : +req.params.id
    let data = {
      currentReader: { id: req.user.id, name: req.user.member.name }
    }
    data['messages'] = await this.#service.findMessages(id);
  
    return this.ok(res, data, "chatrecap berhasil didapatkan");
  })

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body.userId);
    return this.created(res, data, "chatrecap berhasil dibuat");
  });

  readMessage = this.wrapper(async (req, res) => {
    const data = await this.#service.readMessage(+req.params.id);
    return this.created(res, data, "Seluruh Chat berhasil dibaca");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "chatrecap berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "chatrecap berhasil dihapus");
  });
}

export default chatrecapController;
