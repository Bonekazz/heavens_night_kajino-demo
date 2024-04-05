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

    async getRoom(id: string) {
        const roomExist = await this.prisma.room.findFirst({
            where: {
                id: id
            }
        });

        if(!roomExist) return {found: false, message: "room dont exist"};

        await this.prisma.$disconnect();

        return {found: true, data: roomExist, message: "room found"};

    }
}