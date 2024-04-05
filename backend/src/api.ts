import Express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AuthController } from "./modules/auth/auth.controller";
import { UserController } from "./modules/user/user.controller";
import { RoomController } from "./modules/room/room.controller";
import { BonusController } from "./modules/bonus/bonus.controller";
import { AuthMiddleware } from "./modules/auth/auth.middleware";
import { AuthService } from "./modules/auth/auth.service";
import { UserService } from "./modules/user/user.service";
import { RoomService } from "./modules/room/room.service";
import { BonusService } from "./modules/bonus/bonus.service";

import {serverlog} from "./utils/colored_logs";
import { CORS_CONFIG } from "./config/config";
import { prisma } from "./database/prisma.service";
import { BetController } from "./modules/bet/bet.controller";
import { BetService } from "./modules/bet/bet.service";
import { ticketSchedule } from "./schedules/ticket.schedule";
import gameController from "./modules/game/game.controller";

const userController = new UserController(new UserService(prisma));
const authController = new AuthController(new AuthService(prisma));
const roomController = new RoomController(new RoomService(prisma), userController);
const bonusController = new BonusController(new BonusService(prisma));
const betController = new BetController(new BetService(prisma), userController);

const api = Express();
api.use(cors(CORS_CONFIG));
api.use(cookieParser());
api.use(Express.json());

api.post("/api/login", 
    (request, response) => authController.login(request, response)
);

api.post("/api/users", 
    (request, response) => userController.createUser(request, response)
); // criar user

api.get("/api/rooms", 
    (request, response, next) => AuthMiddleware(request, response, next), 
    (request, response) => roomController.getList(request, response)
); 

// api.get(¬/api/bonus") // to check if the bonus is available
api.post("/api/claimBonus", 
    (request, response, next) => AuthMiddleware(request, response, next),
    (request, response) => bonusController.claimBonus(request, response)
);


api.get("/api/room", 
    (request, response, next) => AuthMiddleware(request, response, next),
    (request, response) => roomController.checkBalance(request, response)
);

// api.get("/api/room/:roomId"){     //Para entrar em uma sala
    // TODO: verificar se o usuario tem permissao para estar na rommId

    // TODO: verificar se o usuario tem saldo suficiente para fazer a aposta
//} 

api.post("/api/bet",
    (request, response, next) => AuthMiddleware(request, response, next),
    (request, response, next) => roomController.checkBalance(request, response, next) , // {check if I have the minmum ammount to be in this room, else redirect}
    (request, response, next) => betController.checkBalance(request, response, next),     // {check if my bet matches my balance and the room's min bet}      
    (request, response, next) => gameController.genResult(request, response, next),
    (request, response) => betController.placeBet(request, response)
    // (set bet) (generate result based on room-game)
    // {my user info will be on the localStorage(request.body)}
);


const server = api.listen(3000, () => {
    serverlog("Server running on: http://localhost:3000");
    ticketSchedule.run();
});

process.on("SIGINT", () => {    // Interrupção de programa (CTRL + C)
    console.log("\n");
    server.close(() => {
        ticketSchedule.stop();
        serverlog("Server Closed.");
        process.exit(); // Saindo do processo Node.js
    });
});