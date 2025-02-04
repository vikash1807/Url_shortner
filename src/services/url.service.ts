import { PrismaClient } from "@prisma/client";
import { generateShortCode } from "../utils/shortCodeGenerator.util";
const prisma = new PrismaClient;

export const generateShortUrl = async (originalUrl : string, userId : number) => {

    const urlData  = await prisma.url.findUnique({
        where : {originalUrl},
    });

    if(urlData) {
        return urlData.shortCode;
    }

    const shortCode : string = generateShortCode();

    const newUrl = await prisma.url.create({
        data : {
            originalUrl,
            shortCode,
            user : {connect : {id : userId}},
        },
    })
    
    return newUrl.shortCode;
}