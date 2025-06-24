import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import { sendOn } from "../../socket/index.js";
import chatService from "./chat.service.js";

class chatController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new chatService();
  }

  checkType(body){
    if(body.fileLink) return "F"
    if(body.imageLink) return "I"
    if(body.message) return "T"
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

  create = this.wrapper(async (req, res) => {
    req.body['type'] = this.checkType(req.body)
    const data = await this.#service.create(req.body);
    return this.created(res, data, "chat berhasil dibuat");
});

  send = this.wrapper(async (req, res) => {
    req.body['senderId'] = req.user.id
    req.body['type'] = this.checkType(req.body)
    const data = await this.#service.send(req.body);
    sendOn("message_refresh", { userIds: [req.body.senderId, req.body.receiverId] })
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
