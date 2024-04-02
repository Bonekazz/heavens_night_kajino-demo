import { PrismaClient } from "@prisma/client";

export class RoomService {
    constructor(private prisma: PrismaClient) {}

    async list() {
        
        try {
            const rooms = await this.prisma.room.findMany(); 
            return {rooms};
        } catch (error) {
            return {error: error};
        } finally {
           await this.prisma.$disconnect();
        }
        

    }
}