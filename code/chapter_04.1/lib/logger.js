const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");

class Logger {
    /**
     * @type {LogConfig}
     */
    #config;

    /**
     * @returns {Logger} Uma nova instância de Logger com os valores padrão.
     */
    static with_defaults() {
        return new Logger();
    }

    /**
     * 
     * @param {LogConfig} log_config 
     * @returns {Logger} Uma nova instância de Logger com a configuração fornecida.
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
     * @returns {LogLevel} O log level atual.
     */
    get level() {
        return this.#config.level;
    }
}

module.exports = { Logger };