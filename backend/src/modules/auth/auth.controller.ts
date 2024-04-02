import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { prisma } from "../../database/prisma.service";

class AuthController {
    constructor(private authService: AuthService) {}

    async login(request: Request, response: Response) {

        const {username, password} = request.body;

        return response.json(await this.authService.authenticate({username, password}));
        
    }
}

export default new AuthController(new AuthService(prisma));