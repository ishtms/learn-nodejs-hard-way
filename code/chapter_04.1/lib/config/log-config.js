const fs = require("node:fs");

const { LogLevel } = require("../utils/log-level");
const { RollingConfig } = require("./rolling-config");

class LogConfig {
    /**
     * @type {LogLevel}
     * @private
     * @description O log level a ser utilizado.
     */
    #level = LogLevel.Info;

    /**
     * @type RollingConfig
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

    /**
     * @param {LogConfig} log_config A configuração de log a ser validada.
     * @throws {Error} Se o log_config não for uma instância de LogConfig.
     */
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

module.exports = { LogConfig };
