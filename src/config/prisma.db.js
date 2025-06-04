import { PrismaClient } from "@prisma/client";
import { createUserMember } from "../middlewares/prisma/create-user.middleware.js";

const prism = new PrismaClient().$extends({
    query: {
        user: {
            create: createUserMember
        }
    }
});

export default prism
