import BaseService from '../../base/service.base.js';
import { formatPhoneNumber } from '../../helpers/phoneNumber.js';
import { getQr, startWhatsApp } from '../../whatsapp/client.js';
import prism from '../../config/prisma.db.js';
import fs from 'fs';

class WhatsappService extends BaseService {
	constructor() {
		super(prism);
	}

	getQRAuth = async (sessionId) => {
		const qr = getQr(sessionId);
		return qr;
	};

  startWhatsappClient = async (io) => {
    const server = await startWhatsApp(io);
    return server;
  }

	sendMessage = async (payload) => {
		const sesi = this.db.whatsappService.findFirst({
			where: { isActive: true },
		});
		if (!sesi) return;
		const { number, message, type } = payload;
		const phone = formatPhoneNumber(number);
		const jid = `${phone}@s.whatsapp.net`;
		const client = getWhatsappClient();
		return client.sendMessage(jid, { text: message });
	};
}

export default WhatsappService;
