import chalk from "chalk";

class Logger {
    private id: string = '';
    constructor(id: string = '') {
        this.id = id;
    }

    info(message: string) {
        console.log(chalk.yellowBright(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`) + ' ' + chalk.magentaBright(`[${this.id || '-'}]`) + ': ' + chalk.greenBright(message));
    }

    danger(message: string) {
        console.log(chalk.yellowBright(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`) + ' ' + chalk.magentaBright(`[${this.id || '-'}]`) + ': ' + chalk.red(message));
    }

    setID(id: string) {
        this.id = id;
    }
}

export default Logger;