import { NextFunction, Request, Response } from "express";
import { HeadsOrTails } from "./games/headsOrTails";

export class GameController {
    constructor(private headsOrTails: HeadsOrTails){}

    genResult(request: Request, response: Response, next: NextFunction) {

        const game = request.roomGame as string;
        const userOpt = request.query.betOpt as string;

        if(game === "heads or tails")
        {
            const gameResult = this.headsOrTails.genResult(userOpt);
            request.result = gameResult; 
            request.win = gameResult.win ? true : false;
           
        } 

        if(game === "card game") return response.status(200).json({message: "game not implemented yet."});

        next(); 
    }
}

export default new GameController(new HeadsOrTails());