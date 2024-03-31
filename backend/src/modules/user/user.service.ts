import { PrismaClient } from "@prisma/client";
import { userDTO } from "./user.dto";

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async create(data: userDTO) {
        const userExist = await this.prisma.user.findUnique({
            where: {
                name: data.name
            }
        });

        if(userExist) return {message: "this username is already taken!"};

        const newUser = await this.prisma.user.create({
            data: {
                id: data.id,
                name: data.name,
                pass: data.pass,
                coins: data.coins,
                tickets: data.tickets,
                createdAt: undefined,
            },
        });

        await this.prisma.$disconnect();

        return {message: "user created with sucess!"};
    }
}