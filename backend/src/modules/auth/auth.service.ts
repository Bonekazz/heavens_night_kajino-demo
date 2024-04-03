import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config";
import { Response } from "express";

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async authenticate({username, password}) {

        const user = await this.prisma.user.findFirst({
            where: {
                name: username,
            }
        });

        await this.prisma.$disconnect();

        if(!user) return {sucess: false, message: "user dont exist!"};

        const isSamePass = await compare(password, user.pass);
        if(!isSamePass) return {sucess: false, message: "invalid password"};

        const token = sign({id: user.id}, SECRET_KEY, {expiresIn: "1d"});

        return {sucess: true, message: "logged with success!", token: token};
        
    }
}