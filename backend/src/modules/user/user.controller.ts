import { Request, Response } from "express";
import { UserService } from "./user.service";
import { prisma } from "../../database/prisma.service";

import { v4 as uuidv4 } from 'uuid';

class UserController {
    constructor(private userService: UserService){}

    async createUser(request: Request, response: Response) {
        const {name, password} = request.body;

        const data = {
            id: uuidv4(),
            name: name,
            pass: password,
            coins: 200,
            tickets: 10,
        };

        return response.json(await this.userService.create(data));
    }
}

export default new UserController(new UserService(prisma));