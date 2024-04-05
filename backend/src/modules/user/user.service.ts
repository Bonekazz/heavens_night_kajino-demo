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

    async balance(id: string) {
        const userexist = await this.prisma.user.findFirst({
            where: {
                id: id
            }
        });

        if(!userexist) return {found: false, message: "user dont exist"};

        await this.prisma.$disconnect();

        return {found: true, message: "user found!", balance: userexist.coins};
    }

    async decrementBalance(id:string, value: number) {
        const userexist = await this.prisma.user.update({
            where: {id: id,},
            data: {
                coins: {
                    decrement: value,
                }
            }
        });

        await this.prisma.$disconnect();

        if(!userexist) return {error: true, message: "user not found"};

        return {error: false, message: "balance decremented with success", currentBalance: userexist.coins};
    }

    async incrementBalance(id:string, value: number) {
        const userexist = await this.prisma.user.update({
            where: {id: id,},
            data: {
                coins: {
                    increment: value,
                }
            }
        });

        await this.prisma.$disconnect();

        if(!userexist) return {error: true, message: "user not found"};

        return {error: false, message: "balance increment with success", currentBalance: userexist.coins};
    }
}