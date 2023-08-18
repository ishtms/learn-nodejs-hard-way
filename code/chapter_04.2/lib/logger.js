const fs = require("node:fs/promises");
const path = require("node:path");

const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");
const { check_and_create_dir } = require("./utils/helpers");

class Logger {
    #config;
    #log_file_handle;
    static with_defaults() {
        return new Logger();
    }
    async #log(message, log_level) {
        if (log_level < this.#config.level || !this.#log_file_handle.fd) {
            return;
        }

        await this.#log_file_handle.write(message);
    }

    debug(message) {
        this.#log(message, LogLevel.Debug);
    }

    info(message) {
        this.#log(message, LogLevel.Info);
    }

    warn(message) {
        this.#log(message, LogLevel.Warn);
    }

    error(message) {
        this.#log(message, LogLevel.Error);
    }

    critical(message) {
        this.#log(message, LogLevel.Critical);
    }

    static with_config(log_config) {
        return new Logger(log_config);
    }

    constructor(log_config) {
        log_config = log_config || LogConfig.with_defaults();
        LogConfig.assert(log_config);
        this.#config = log_config;
    }
    async init() {
        const log_dir_path = check_and_create_dir("logs");

        const file_name = this.#config.file_prefix + new Date().toISOString().replace(/\..+/, "") + ".log";
        this.#log_file_handle = await fs.open(path.join(log_dir_path, file_name), "a+");
    }

    get level() {
        return this.#config.level;
    }

    get file_prefix() {
        return this.#config.file_prefix;
    }

    get time_threshold() {
        return this.#config.rolling_config.time_threshold;
    }

    get size_threshold() {
        return this.#config.rolling_config.size_threshold;
    }
}

module.exports = { Logger };
