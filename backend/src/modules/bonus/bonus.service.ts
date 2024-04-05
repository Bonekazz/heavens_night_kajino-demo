import { PrismaClient } from "@prisma/client";

export class BonusService {
    constructor(private prisma: PrismaClient){}

    
    async verifyClaim(id: string) {

        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: id,
                }
            });

            if(!user) return {error: "user not found"};
            if(user.hasClaimedBonus) return {message: "you have already claimed your daily bonus"};

            await this.prisma.user.update({
                where: {id: id},
                data: {
                    coins: user.coins + 500,
                    hasClaimedBonus: true
                }
            });

            return {message: "You have received your daily bonus!", coins: 500};

        } catch (error) {
            return {error: error};
        } finally {
            await this.prisma.$disconnect();
        }
        
    }
}