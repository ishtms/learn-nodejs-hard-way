class LogLevel {
    static #Debug = 0;
    static #Info = 1;
    static #Warn = 2;
    static #Error = 3;
    static #Critical = 4;

    /**
     * @param {number} log_level
     */
    static to_string(log_level) {
        const levelMap = {
            [this.Debug]: "DEBUG",
            [this.Info]: "INFO",
            [this.Warn]: "WARN",
            [this.Error]: "ERROR",
            [this.Critical]: "CRITICAL"
        };
        
        if (levelMap.hasOwnProperty(log_level)) {
            return levelMap[log_level];
        }
        
        throw new Error(`Unsupported log level ${log_level}`);
    }

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
