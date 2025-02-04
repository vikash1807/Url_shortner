import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient;

export const findUrl = async (shortCode : string) => {
    return await prisma.url.findUnique({
        where: { shortCode },
    });
}