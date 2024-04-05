import { Request, Response } from "express";
import { BonusService } from "./bonus.service";

export class BonusController {
    constructor(private bonusService: BonusService) {}

    async claimBonus(request: Request, response: Response) {
        const id = request.userId;

        if(!id) return response.status(401).json({error: "userId not provided"});

        return response.json(await this.bonusService.verifyClaim(id));
    }

}