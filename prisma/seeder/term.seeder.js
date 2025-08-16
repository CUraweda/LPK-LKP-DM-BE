import prism from "../../src/config/prisma.db.js";

export async function seedTerm() {
    await prism.termReference.createMany({
        data: [
            { title: "Persetujuan Orangtua dan Wali", type: "PERSETUJUAN_ORANGTUA", content: "Dengan menyetujui hal dibawah ini, anda telah menerima bahwa Orangtua/Wali anda setuju untuk berkontribusi didalam pelatihan yang dilaksanakan LPK" },
            { title: "Persetujuan Pembayaran", type: "PERSETUJUAN_PEMBAYARAN", content: "Dengan menyetujui hal dibawah ini, anda telah menerima bahwa  anda setuju untuk membayar hingga nominal yang ditentukan di awal oleh pihak LPK" },
        ],
        skipDuplicates: true
    })
}