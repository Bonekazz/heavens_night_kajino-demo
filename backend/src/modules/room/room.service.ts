import { PrismaClient } from "@prisma/client";

export class RoomService {
    constructor(private prisma: PrismaClient) {}

    async list() {
        
        try {
            const rooms = await this.prisma.room.findMany(); 
            return {success: true, rooms: rooms};
        } catch (error) {
            return {success: false, message: error};
        } finally {
           await this.prisma.$disconnect();
        }
        

    }
}