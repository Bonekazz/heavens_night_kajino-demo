import Express  from "express";
import userController from "./modules/user/user.controller";
import authController from "./modules/auth/auth.controller";
import { AuthMiddleware } from "./modules/auth/auth.middleware";
import roomController from "./modules/room/room.controller";
import bonusController from "./modules/bonus/bonus.controller";

const api = Express();
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


//api.get("/api/rooms/:roomId");
// api.get("/api/rooms/:roomId?params..");

// api.get("/api/room/:roomId"){     //Para entrar em uma sala
    // TODO: verificar se o usuario tem permissao para estar na rommId

    // TODO: verificar se o usuario tem saldo suficiente para fazer a aposta
//} 

// api.post("/api/bets") 
// api.get("/api/bets") + query params para filtros

api.listen(3000, () => {
    console.log("server running on: http://localhost:3000");
    // console.log("[SERVER]: Executing shecdules ...")
    // try {
        // shell.execute(cronjob)
    // } catch (error) {
        // console.log(`[ERROR]: ${error}`)
    // }
});