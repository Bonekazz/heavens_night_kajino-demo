import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { prisma } from "../../database/prisma.service";

class AuthController {
    constructor(private authService: AuthService) {}

    async login(request: Request, response: Response) {

        const {username, password} = request.body;

        if(!username || !password) return response.json({error: "parametros invalidos (undefined)"});

        const serviceRes = await this.authService.authenticate({username, password});

        if(!serviceRes.sucess) return response.status(401).json(serviceRes);

        console.log("cookie adicionado ao client");
        return response
                .status(200)
                .cookie("heavensNightKajinoToken", serviceRes.token, {httpOnly: true, sameSite: "none", secure: true})
                .json({success: serviceRes, message: serviceRes.message});
        
    }
}

export default new AuthController(new AuthService(prisma));