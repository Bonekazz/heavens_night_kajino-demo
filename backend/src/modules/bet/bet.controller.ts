import { NextFunction, Request, Response } from "express";
import { UserController } from "../user/user.controller";
import { BetService } from "./bet.service";

export class BetController {
    constructor(private betService: BetService, private userController: UserController){}

    async checkBalance(request: Request, response: Response, next: NextFunction) {
        // {check if my bet matches my balance and the room's min bet} 

        const betValue = Number(request.query.betVal);
        const userid = request.userId;
        const userBalance = request.userBalance;

        if(!betValue) return response.status(200).json({permission: "denied", message: "bet value not provided"});
        if(!userid) return response.status(200).json({permission: "denied", message: "user not provided"});

        if(betValue > userBalance) 
        {
            return response.status(403).json({permission: "denied", message: "you dont have enough coins to place this bet"}); 
        }

        next();

    }

    async placeBet(request: Request, response: Response){

        const id = request.userId;
        const betVal = Number(request.query.betVal);

        if(!betVal || !id) return response.status(200).json({error: true, message: "invalid params (betVal, userId)"});

        const userBalance = request.win === true ? await this.userController.incrementBalance(id, betVal) : await this.userController.decrementBalance(id, betVal);

        if(userBalance.error) return response.status(200).json({error: true, message: userBalance.message});

        response.status(200)
            .json({
                error: userBalance.error,
                message: userBalance.message,
                data: {
                    result: {...request.result, palyerOption: request.query.betOpt},
                    currentBalance: userBalance.currentBalance,
                }
            });
    }
}