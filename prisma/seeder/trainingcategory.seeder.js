import prism from "../../src/config/prisma.db.js";

export async function seedTrainingCategory() {
    const publicUrl = process.env.BACKEND_URL + "/public/assets/"
    await prism.trainingCategory.createMany({
        data: [
            //? TATA BUSANA
            {
                title: "Tata Busana",
                uid: "TB-1",
                level: 1,
                image: `${publicUrl}/tata_busana.jpg`
            },
            {
                title: "Tata Busana",
                uid: "TB-1",
                level: 2,
                image: `${publicUrl}/tata_busana.jpg`
            },
            {
                title: "Tata Busana",
                uid: "TB-1",
                level: 3,
                image: `${publicUrl}/tata_busana.jpg`
            },

            //? BUSANA INDUSTRI
            {
                title: "Busana Industri",
                uid: "BI-1",
                level: 1,
                image: `${publicUrl}/busana_industri.jpg`
            },
            {
                title: "Busana Industri",
                uid: "BI-2",
                level: 2,
                image: `${publicUrl}/busana_industri.jpg`
            },
            {
                title: "Busana Industri",
                uid: "BI-3",
                level: 3,
                image: `${publicUrl}/busana_industri.jpg`
            },
            
            //? LENAN RUMAH TANGGA
            {
                title: "Lenan Rumah Tangga",
                uid: "LRT-1",
                level: 1,
                image: `${publicUrl}/lenan_rumah_tangga.jpg`
            },
            {
                title: "Lenan Rumah Tangga",
                uid: "LRT-2",
                level: 2,
                image: `${publicUrl}/lenan_rumah_tangga.jpg`
            },
            {
                title: "Lenan Rumah Tangga",
                uid: "LRT-3",
                level: 3,
                image: `${publicUrl}/lenan_rumah_tangga.jpg`
            }
        ],
        skipDuplicates: true
    })
}