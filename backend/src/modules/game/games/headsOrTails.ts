export class HeadsOrTails {
    constructor() {}

    genResult(playerOption: string) {
        const options = ["heads", "tails"];
        const randomIndex = Math.floor(Math.random() * options.length);
        const result = options[randomIndex];

        if(result !== playerOption) return {win: false, result: result};

        return {win: true, result: result};
    }
}