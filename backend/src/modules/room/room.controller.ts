import { Request, Response } from "express";
import { RoomService } from "./room.service";
import { prisma } from "../../database/prisma.service";

export class RoomController {
    constructor(private roomService: RoomService) {}

    async getList(request: Request, response: Response) {

        return response.json(await this.roomService.list());
    }
}

export default new RoomController(new RoomService(prisma));