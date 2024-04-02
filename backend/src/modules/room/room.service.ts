import { PrismaClient } from "@prisma/client";

export class RoomService {
    constructor(private prisma: PrismaClient) {}

    async list() {

        const rooms = await this.prisma.room.findMany();
        console.log(rooms);
        return {rooms};

    }
}