import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(request: Request, response: Response) {

        const {username, password} = request.body;

        if(!username || !password) return response.json({error: "parametros invalidos (undefined)"});

        const user = await this.authService.authenticate({username, password});

        if(!user.found || user.permission === "denied") return response.status(401).json(user);

        return response
                .status(200)
                .cookie("heavensNightKajinoToken", user.token, {httpOnly: true, sameSite: "none", secure: true})
                .json({
                    permission: user.permission, 
                    cookie: "set",
                    message: user.message, 
                    userData: user.data,
                });
        
    }
}
