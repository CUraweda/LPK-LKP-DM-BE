import prism from '../config/prisma.db.js';
import { startWhatsApp } from '../whatsapp/client.js';

export const startAllService = async (io) => {
	const session = await prism.whatsappService.findMany({
		where: { isActive: true },
	});

	for (const sesi of session) {
		try {
			if (sesi.isActive) {
				await startWhatsApp(io, sesi.id);
			}

		} catch (err) {
			console.error(
				`❌ Failed to start WhatsApp session ${sesi.id}:`,
				err
			);
		}
	}
};
