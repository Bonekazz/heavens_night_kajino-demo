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

        if(!user) return {message: "user dont exist!"};

        const isSamePass = await compare(password, user.pass);
        if(!isSamePass) return {message: "invalid password"};

        const token = sign({id: user.id}, SECRET_KEY, {expiresIn: "1d"});

        return {message: "logged with success!", data: {username: user.name, token: token}};
        
    }
}