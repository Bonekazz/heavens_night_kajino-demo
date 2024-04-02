import logger from "node-color-log";

export default function serverlog(text: string) {
    logger.color("white").bgColor("green").bold().log(`[SERVER]: ${text}`);
}