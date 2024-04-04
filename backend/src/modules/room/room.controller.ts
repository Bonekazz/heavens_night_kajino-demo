import { NextFunction, Request, Response } from "express";
import { RoomService } from "./room.service";
import { UserController } from "../user/user.controller";

export class RoomController {
    constructor(private roomService: RoomService, private userController: UserController) {}

    async getList(request: Request, response: Response) {

        return response.json(await this.roomService.list());
    }

    async checkBalance(request: Request, response: Response, next?: NextFunction) {

        const roomId = request.query.room as string;
        const room = await this.roomService.getRoom(roomId);

        if(!room.found)
        {
            return response.status(200).json({permission: "denied", message: room.message});
        }

        const userId = request.userId;
        const user = await this.userController.getBalance(userId);

        if(!user.found)
        {
            return response.status(200).json({permission: "denied", message: user.message});
        }

        const balance = user.balance;
        const minBet = room.data.minBet;

        if(balance < minBet) 
        {
            return response.status(403).json({permission: "denied", message: "you dont have enough coins to be in this room", redirectUrl: "/"});
        }

        if(!next) return response.status(200).json({permission: "accepted", message: "your balance matches the room's min bet"});

        request.userBalance = balance;
        request.roomGame = room.data.game;
        next();
       
    }
}