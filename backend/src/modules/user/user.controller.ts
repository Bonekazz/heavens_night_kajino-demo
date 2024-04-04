import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
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

    async getBalance(id: string) {

        return await this.userService.balance(id);
    }

    async decrementBalance(id:string, value: number) {
        return await this.userService.decrementBalance(id, value);
    }

    async incrementBalance(id:string, value: number) {
        return await this.userService.incrementBalance(id, value);
    }

}
