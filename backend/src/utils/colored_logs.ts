import logger from "node-color-log";


export function serverlog(text: string) {
    logger.color("white").bgColor("green").bold().log(`[SERVER]: ${text}`);
}

export function errorlog(text: string){
    logger.color("white").bgColor("red").bold().log(`[SERVER-ERROR]: ${text}`);
}

export function schedlog(text: string){
    logger.color("white").bgColor("cyan").bold().log(`[schedule]${text}`);
}