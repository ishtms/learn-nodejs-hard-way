const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");

class Logger {
    /**
     * @type {LogConfig}
     */
    #config;

    /**
     * @returns {Logger} A new instance of Logger with default config.
     */
    static with_defaults() {
        return new Logger();
    }

    /**
     * 
     * @param {LogConfig} log_config 
     * @returns {Logger} A new instance of Logger with the given config.
     */
    static with_config(log_config) {
        return new Logger(log_config);
    }

    /**
     * @param {LogLevel} log_level
     */
    constructor(log_config) {
        log_config = log_config || LogConfig.with_defaults();
        LogConfig.assert(log_config);
        this.#config = log_config;
    }

    /**
     * @returns {LogLevel} The current log level.
     */
    get level() {
        return this.#config.level;
    }
}

module.exports = { Logger };