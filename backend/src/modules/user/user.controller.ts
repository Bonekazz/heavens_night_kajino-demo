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

        const serviceRes = await this.userService.create(data);

        if(!serviceRes.success) return response.status(401).json(serviceRes);
        return response.status(200)
            .cookie("heavensNightKajinoToken", serviceRes.token, {httpOnly: true, sameSite: "none", secure: true})
            .json({success: true, user: serviceRes.user});
    }
}

export default new UserController(new UserService(prisma));