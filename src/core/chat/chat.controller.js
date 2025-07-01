import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import chatrecapService from "../chatrecap/chatrecap.service.js";
import chatService from "./chat.service.js";
class chatController extends BaseController {
  #service; #chatRecapService;

  constructor() {
    super();
    this.#service = new chatService();
    this.#chatRecapService = new chatrecapService()
  }

  checkType(req) {
    if (!req.file) return { type: "T" }
    switch (req.file.mimetype) {
      case 'application/pdf' || 'application/msword' || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return { fileLink: req.file.path, fileSize: req.file.size, type: "F" }
      case 'image/jpeg' || 'image/jpg' || 'image/png':
        return { fileLink: req.file.path, fileSize: req.file.size, type: "I" }
    }
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak chat berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("chat tidak ditemukan");

    return this.ok(res, data, "chat berhasil didapatkan");
  });

  findByUser = this.wrapper(async (req, res) => {
    const data = await this.#service.findByUser(req.user.id)
    return this.ok(res, data, "chat berhasil didapatkan");
  });

  sendAdmin = this.wrapper(async (req, res) => {
    req.body['senderId'] = req.user.id
    req.body['chatRecapId'] = await this.#chatRecapService.checkAndCreate(req.body['chatRecapId'])
    req.body = { ...req.body, ...this.checkType(req) }
    const data = await this.#service.sendAdmin(req.body);
    this.#chatRecapService.newMessage(data.chatRecapId, { unreadUp: false, messageUp: true} )
    return this.created(res, data, "chat berhasil dibuat");
  });

  send = this.wrapper(async (req, res) => {
    req.body['senderId'] = req.user.id
    req.body['chatRecapId'] = await this.#chatRecapService.checkAndCreate(req.user.id)
    req.body = { ...req.body, ...this.checkType(req) }
    console.log(req.body)
    const data = await this.#service.send(req.body);
    this.#chatRecapService.newMessage(data.chatRecapId)
    return this.created(res, data, "chat berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "chat berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "chat berhasil dihapus");
  });
}

export default chatController;
