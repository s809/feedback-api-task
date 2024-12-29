import { User } from "@prisma/client";
import { prisma } from "../database";

export async function generateTokenFor(user: User) {
    // Generate access token
    const accessToken = require("crypto").randomBytes(16).toString('hex');
    await prisma.accessToken.create({
        data: {
            user_id: user.id,
            token: accessToken,
        }
    });

    return accessToken;
}