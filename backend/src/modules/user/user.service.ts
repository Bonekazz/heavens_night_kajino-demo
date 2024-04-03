import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { SECRET_KEY } from "../../config/config";

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async create({name, pass}) {
        const userExist = await this.prisma.user.findUnique({
            where: {
                name: name
            }
        });

        if(userExist) return {success: false, message: "this username is already taken!"};

        const hashedpass = await hash(pass, 8);

        const newUser = await this.prisma.user.create({
            data: {
                name: name,
                pass: hashedpass,
                coins: 200,
                tickets: 10,
                fingers: 10,
            },
        });

        await this.prisma.$disconnect();

        const token = sign({id: newUser.id}, SECRET_KEY, {expiresIn: "1d"});
        return {
            success: true, 
            message: "user created with sucess!", 
            token: token, user: {
            username: name,
            coins: 200,
            tickets: 10,
            fingers: 10
        }};
    }
}