import { Request, Response } from "express";
import { UserService } from "./user.service";
import { prisma } from "../../database/prisma.service";

class UserController {
    constructor(private userService: UserService){}

    async createUser(request: Request, response: Response) {
        const {name, password} = request.body;

        const data = {
            name: name,
            pass: password,
        };

        return response.json(await this.userService.create(data));
    }
}

export default new UserController(new UserService(prisma));