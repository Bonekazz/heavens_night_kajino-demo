import { prisma } from "../database/prisma.service";
import { errorlog, schedlog} from "../utils/colored_logs";
import schedule from "node-schedule";

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

function steps(x: number) {
    const minutos = [];
    for (let i = 0; i < 60; i += x) {
        minutos.push(i);
    }
    return minutos;
}

const interval = steps(10);
export const ticketSchedule = {
    run: () => {
        schedlog("-[ticket] running schedule (in the server's process)");
        schedule.scheduleJob({minute: interval, second: 0}, async () => {
            try {
                await prisma.user.updateMany({
                    data: {
                        tickets: {
                            increment: 10,
                        }
                    }
                });
            } catch (error) {
                errorlog(error);
            } finally {
                await prisma.$disconnect();
                schedlog(`10 tickets foram dados a todos os usuarios ...`);
            }
        });
    },

    stop: () => {
        schedlog("[ticket] schedule closed.");
    }
};