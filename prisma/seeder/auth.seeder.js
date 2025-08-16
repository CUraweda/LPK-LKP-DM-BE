import { roleConstant } from "../../src/config/constant.js";
import prism from "../../src/config/prisma.db.js";
import { hash } from "../../src/helpers/bcrypt.helper.js";

export async function userRole() {
    const adminExist = await prism.user.findUnique({ where: { email: "dummyadmin@gmail.com" } })
    if (!adminExist) {
        await prism.user.create({
            data: {
                email: "dummyadmin@gmail.com",
                password: await hash("dummypass"),
                roleId: 1
            }
        })
    }
    const siswaExist = await prism.user.findUnique({ where: { email: "dummysiswa@gmail.com" } })
    if (!siswaExist) {
        await prism.user.create({
            data: {
                email: "dummysiswa@gmail.com",
                password: await hash("dummypass"),
                roleId: 2
            }
        })
    }

    const instrukturExist = await prism.user.findUnique({ where: { email: "dummysiswa@gmail.com" } })
    if (!instrukturExist) {
        await prism.user.create({
            data: {
                email: "dummyinstruktur@gmail.com",
                password: await hash("dummypass"),
                roleId: 3
            }
        })
    }
    
    const pengurusExist = await prism.user.findUnique({ where: { email: "dummysiswa@gmail.com" } })
    if (!pengurusExist) {
        await prism.user.create({
            data: {
                email: "dummypengurus@gmail.com",
                password: await hash("dummypass"),
                roleId: 4
            }
        })
    }
}