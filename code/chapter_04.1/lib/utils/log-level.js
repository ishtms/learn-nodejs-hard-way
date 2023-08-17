class LogLevel {
    static #Debug = 0;
    static #Info = 1;
    static #Warn = 2;
    static #Error = 3;
    static #Critical = 4;

    static get Debug() {
        return this.#Debug;
    }

    static get Info() {
        return this.#Info;
    }

    static get Warn() {
        return this.#Warn;
    }

    static get Error() {
        return this.#Error;
    }

    static get Critical() {
        return this.#Critical;
    }

    static assert(log_level) {
        if (![this.Debug, this.Info, this.Warn, this.Error, this.Critical].includes(log_level)) {
            throw new Error(
                `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`
            );
        }
    }
}

module.exports = { LogLevel };
