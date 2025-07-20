import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import WhatsappService from './whatsapp.service.js';

class WhatsappController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new WhatsappService();
  }

 startWhatsapp = this.wrapper(async (req, res) => {
    const io = req.app.get('io');
    await this.#service.startWhatsappClient(io);
    return this.ok(res, true, 'server whatsapp telah berjalan');
  });
  
  getQr = this.wrapper(async (req, res) => {
    const data = await this.#service.getQRAuth(req.query.id);
    return this.ok(res, data, 'QR Auth Berhasil di dapatkan');
  });

  sendMessage = this.wrapper(async (req, res) => {
    const data = await this.#service.sendMessage(req.body);
    return this.ok(res, data, 'berhasil mengirim pesan');
  });

}

export default WhatsappController;
