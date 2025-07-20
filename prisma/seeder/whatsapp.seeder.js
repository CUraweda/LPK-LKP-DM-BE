import prism from "../../src/config/prisma.db.js";

export async function seedWhatsapp() {
    await prism.whatsappService.create({
    data: { session: "Admin", isActive: false },
  });
}