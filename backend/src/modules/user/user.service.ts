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

        if(userExist) return {message: "this username is already taken!"};

        const hashedpass = await hash(pass, 8);

        const newUser = await this.prisma.user.create({
            data: {
                id: undefined,
                name: name,
                pass: hashedpass,
                coins: 200,
                tickets: 10,
                fingers: 10,
                createdAt: undefined,
            },
        });

        await this.prisma.$disconnect();

        const token = sign({id: newUser.id}, SECRET_KEY, {expiresIn: "1d"});
        return {message: "user created with sucess!", data: {username: name, token: token}};
    }
}