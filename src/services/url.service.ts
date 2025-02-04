import { PrismaClient } from "@prisma/client";
import { generateShortCode } from "../utils/shortCodeGenerator.util";
const prisma = new PrismaClient;

export const generateShortUrl = async (originalUrl : string) => {

    const urlData  = await prisma.url.findUnique({
        where : {originalUrl},
    });

    if(urlData) {
        return urlData.shortCode;
    }

    const shortCode : string = generateShortCode();
    

}