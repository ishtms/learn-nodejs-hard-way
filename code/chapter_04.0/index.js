const fs = require("node:fs");

class RollingSizeOptions {
    static OneKB = 1024;
    static FiveKB = 5 * 1024;
    static TenKB = 10 * 1024;
    static TwentyKB = 20 * 1024;
    static FiftyKB = 50 * 1024;
    static HundredKB = 100 * 1024;

    static HalfMB = 512 * 1024;
    static OneMB = 1024 * 1024;
    static FiveMB = 5 * 1024 * 1024;
    static TenMB = 10 * 1024 * 1024;
    static TwentyMB = 20 * 1024 * 1024;
    static FiftyMB = 50 * 1024 * 1024;
    static HundredMB = 100 * 1024 * 1024;

    static assert(size_threshold) {
        if (typeof size_threshold !== "number" || size_threshold < RollingSizeOptions.OneKB) {
            throw new Error(
                `size_threshold must be at-least 1 KB. Unsupported param ${JSON.stringify(size_threshold)}`
            );
        }
    }
}

class RollingTimeOptions {
    static Minutely = 60; // A cada 60 segundos
    static Hourly = 60 * this.Minutely;
    static Daily = 24 * this.Hourly;
    static Weekly = 7 * this.Daily;
    static Monthly = 30 * this.Daily;
    static Yearly = 12 * this.Monthly;

    static assert(time_option) {
        if (![this.Minutely, this.Hourly, this.Daily, this.Weekly, this.Monthly, this.Yearly].includes(time_option)) {
            throw new Error(
                `time_option must be an instance of RollingConfig. Unsupported param ${JSON.stringify(time_option)}`
            );
        }
    }
}

class RollingConfig {
    /**
     * @type {RollingTimeOptions}
     * @private
     *
     * @description Unidades - segundos
     */
    #time_threshold = RollingTimeOptions.Hourly;
    #size_threshold = RollingSizeOptions.FiveMB;

    /**
     * @returns {RollingConfig} Uma nova instância de RollingConfig com os valores padrão.
     */
    static with_defaults() {
        return new RollingConfig();
    }

    /**
     * @param {number} size_threshold Rotaciona/Cria um novo arquivo toda vez que o tamanho atual do arquivo exceder este limite.
     * @returns {RollingConfig} A instância atual de RollingConfig.
     */
    with_size_threshold(size_threshold) {
        RollingSizeOptions.assert(size_threshold);
        this.#size_threshold = size_threshold;
        return this;
    }

    /**
     *  @param {RollingTimeOptions} time_threshold Rotaciona/Cria um novo arquivo toda vez que o tempo de criação do arquivo atual exceder este limite.
     * @returns {RollingConfig} A instância atual de RollingConfig.
     * @throws {Error} Se o time_threshold não for uma instância de RollingTimeOptions.
     */
    with_time_threshold(time_threshold) {
        RollingTimeOptions.assert(time_threshold);
        this.#time_threshold = time_threshold;
        return this;
    }

    /**
     * @param {Object} json O objeto json a ser analisado em {RollingConfig}.
     * @returns {RollingConfig} Uma nova instância de RollingConfig com os valores do objeto json.
     * @throws {Error} Se o json não for um objeto.
     */
    static from_json(json) {
        let rolling_config = new RollingConfig();

        Object.keys(json).forEach((key) => {
            switch (key) {
                case "size_threshold":
                    rolling_config = rolling_config.with_size_threshold(json[key]);
                    break;
                case "time_threshold":
                    rolling_config = rolling_config.with_time_threshold(json[key]);
                    break;
            }
        });

        return rolling_config;
    }
}

class LogConfig {
    /**
     * @type {LogLevel}
     * @private
     * @description Log level a ser utilizado.
     */
    #level = LogLevel.Info;

    /**
     * @type {RollingConfig}
     * @private
     */
    #rolling_config;

    /**
     * @type {string}
     * @private
     * @description O prefixo a ser utilizado como nome do arquivo de log.
     *
     * Se o prefixo do arquivo for `MyFilePrefix_` o arquivo de log criado terá o nome
     * `MyFilePrefix_2021-09-01.log`, `MyFilePrefix_2021-09-02.log` e assim por diante.
     */
    #file_prefix = "Logtar_";

    constructor() {
        this.#rolling_config = RollingConfig.with_defaults();
    }

    /**
     * @returns {LogConfig} Uma nova instância de LogConfig com os valores padrão.
     */
    static with_defaults() {
        return new LogConfig();
    }

    /**
     * @param {string} file_path O path para o arquivo de configuração.
     * @returns {LogConfig} Uma nova instância de LogConfig com os valores do arquivo de configuração.
     * @throws {Error} Se o file_path não for uma string.
     */
    static from_file(file_path) {
        const file_contents = fs.readFileSync(file_path);
        return LogConfig.from_json(JSON.parse(file_contents));
    }

    /**
     * @param {Object} json O objeto json a ser analisado em {LogConfig}.
     * @returns {LogConfig} Uma nova instância de LogConfig com os valores do objeto json.
     */
    static from_json(json) {
        let log_config = new LogConfig();
        Object.keys(json).forEach((key) => {
            switch (key) {
                case "level":
                    log_config = log_config.with_log_level(json[key]);
                    break;
                case "rolling_config":
                    log_config = log_config.with_rolling_config(json[key]);
                    break;
                case "file_prefix":
                    log_config = log_config.with_file_prefix(json[key]);
                    break;
            }
        });
        return log_config;
    }

    static assert(log_config) {
        if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
            throw new Error(
                `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(log_config)}`
            );
        }
    }

    /**
     * @returns {LogLevel} O log level atual.
     */
    get level() {
        return this.#level;
    }

    /**
     * @param {LogLevel} log_level O log level a ser definido.
     * @returns {LogConfig} A atual instância de LogConfig.
     * @throws {Error} Se o log_level não for uma instância de LogLevel.
     */
    with_log_level(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
        return this;
    }

    /**
     * @returns {RollingConfig} A configuração de rotação atual.
     */
    get rolling_config() {
        return this.#rolling_config;
    }

    /**
     * @param {RollingConfig} config A configuração de rotação a ser definida.
     * @returns {LogConfig} A instância atual de LogConfig.
     * @throws {Error} Se config não for uma instância de RollingConfig.
     */
    with_rolling_config(config) {
        this.#rolling_config = RollingConfig.from_json(config);
        return this;
    }

    /**
     * @returns {String} O tamanho máximo de arquivo atual.
     */
    get file_prefix() {
        return this.#file_prefix;
    }

    /**
     * @param {string} file_prefix O prefixo de arquivo a ser definido.
     * @returns {LogConfig} A instância atual de LogConfig.
     * @throws {Error} Se o file_prefix não for uma string.
     */
    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(`file_prefix must be a string. Unsupported param ${JSON.stringify(file_prefix)}`);
        }

        this.#file_prefix = file_prefix;
        return this;
    }
}

class LogLevel {
    static #Debug = 0;
    static #Info = 1;
    static #Warn = 2;
    static #Error = 3;
    static #Critical = 4;

    /**
     * @returns {LogLevel} Uma nova instância de LogLevel com os valores padrão.
     */
    static get Debug() {
        return this.#Debug;
    }

    /**
     * @returns {LogLevel} Uma nova instância de LogLevel com os valores padrão.
     */
    static get Info() {
        return this.#Info;
    }

    /**
     * @returns {LogLevel} Uma nova instância de LogLevel com os valores padrão.
     */
    static get Warn() {
        return this.#Warn;
    }

    /**
     * @returns {LogLevel} Uma nova instância de LogLevel com os valores padrão.
     */
    static get Error() {
        return this.#Error;
    }

    /**
     * @returns {LogLevel} Uma nova instância de LogLevel com os valores padrão.
     */
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

class Logger {
    /**
     * @type {LogConfig}
     */
    #config;

    /**
     * @returns {Logger} Uma nova instância de Logger com os valores padrão.
     * @description O log level padrão é `LogLevel.Info`.
     */
    static with_defaults() {
        return new Logger();
    }

    /**
     * @param {LogConfig} log_config A configuração de log a ser utilizada.
     * @returns {Logger} Uma nova instância de Logger com as configurações de log especificadas.
     * @throws {Error} Se o log_config não for uma instância de LogConfig.
     */
    static with_config(log_config) {
        return new Logger(log_config);
    }

    constructor(log_config) {
        log_config = log_config || LogConfig.with_defaults();
        LogConfig.assert(log_config);
        this.#config = log_config;
    }

    /**
     * Obtém o log level atual.
     *
     * @returns {LogLevel} O log level atual.
     *
     * const logger = new Logger(LogLevel.Debug);
     * console.log(logger.level); // LogLevel.Debug
     * logger.level = LogLevel.Error; // exibe um erro
     * logger.level = LogLevel.Debug; // funciona bem
     * logger.level = 0; // exibe um erro
     */
    get level() {
        return this.#config.level;
    }
}

module.exports = {
    Logger,
    LogLevel,
    LogConfig,
    RollingConfig,
    RollingSizeOptions,
    RollingTimeOptions,
};
