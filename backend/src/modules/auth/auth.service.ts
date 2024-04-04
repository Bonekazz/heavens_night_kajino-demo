import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config";

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async authenticate({username, password}) {

        const user = await this.prisma.user.findFirst({
            where: {
                name: username,
            }
        });

        await this.prisma.$disconnect();

        if(!user) return {found: false, message: "user dont exist!"};

        const isSamePass = await compare(password, user.pass);
        if(!isSamePass) return {permission: "denied", message: "invalid password"};

        const token = sign({id: user.id}, SECRET_KEY, {expiresIn: "1d"});

        return {
            found: true, 
            permission: "accepted",
            message: "logged in with success!", 
            token: token, 
            data: {
                id: user.id,
                username: user.name,
                coins: user.coins,
                tickets: user.tickets,
                fingers: user.fingers,
            }   
        };
        
    }
}