import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async create({id, name, pass, coins, tickets}) {
        const userExist = await this.prisma.user.findUnique({
            where: {
                name: name
            }
        });

        if(userExist) return {message: "this username is already taken!"};

        const hashedpass = await hash(pass, 8);

        await this.prisma.user.create({
            data: {
                id: id,
                name: name,
                pass: hashedpass,
                coins: coins,
                tickets: tickets,
                createdAt: undefined,
            },
        });

        await this.prisma.$disconnect();

        const token = sign({id: id}, "secret-key", {expiresIn: "1d"});
        return {message: "user created with sucess!", data: {username: name, token: token}};
    }
}