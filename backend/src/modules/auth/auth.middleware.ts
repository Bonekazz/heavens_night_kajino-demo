import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config";

declare global {
    namespace Express { 
        interface Request {
            userId?: string;
            userBalance?: number,
            betVal?: number,
            betOpt?: any,
            roomGame?: string,
            win?: boolean,
            result?: any,
        }
    }
}

export function AuthMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
){

    const token = request.cookies.heavensNightKajinoToken;
    if(!token) return response.status(403).json({permission: "denied", message: "token not provided", redirect: `http://localhost:5173/pages/login?next=${request.get('Referer')}`});

    try {

        const decoded = verify(token, SECRET_KEY);
        const {id} = decoded as JwtPayload;
        
        request.userId = id; 
        next();
        
    } catch (error) {
        return response.status(401).json({permission: "denied", message: error});
    }
    
    


}