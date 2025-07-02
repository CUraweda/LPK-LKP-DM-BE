import prism from "../../src/config/prisma.db.js";

export async function seedTrainingCategory() {
    const publicUrl = process.env.BACKEND_URL + "/public/assets/"
    await prism.trainingCategory.createMany({
        data: [
            { title: "Tata Busana", image: `${publicUrl}/tata_busana.jpg` },
            { title: "Busana Industri",  image: `${publicUrl}/busana_industri.jpg` },
            { title: "Lenan Rumah Tangga", image: `${publicUrl}/lenan_rumah_tangga.jpg` }
        ],
        skipDuplicates: true
    })
}