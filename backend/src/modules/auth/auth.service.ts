import { PrismaClient } from "@prisma/client";
import { userDTO } from "../user/user.dto";

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async authenticate({username, password}) {

        const user = await this.prisma.user.findFirst({
            where: {
                name: username,
            }
        });

        if(!user) return {message: "user dont exist!"};
        if(user.pass !== password) return {message: "invalid password"};

        return {message: "logged with success!"};
        
    }
}