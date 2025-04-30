import { roleConstant } from "../../src/config/constant.js";
import prism from "../../src/config/prisma.db.js";

export async function seedRole() {
    await prism.role.createMany({
        data: [
            { name: "Admin", code: "ADMIN", identifier: roleConstant.ADMIN_CODE },
            { name: "Siswa", code: "SISWA", identifier: roleConstant.STUDENT_CODE }
        ],
        skipDuplicates: true
    })
}