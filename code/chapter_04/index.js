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
    static Minutely = 60; // Every 60 seconds
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
     * @description Units - seconds
     */
    #time_threshold = RollingTimeOptions.Hourly;
    #size_threshold = RollingSizeOptions.FiveMB;

    /**
     * @returns {RollingConfig} A new instance of RollingConfig with default values.
     */
    static with_defaults() {
        return new RollingConfig();
    }

    /**
     * @param {number} size_threshold Roll/Create new file every time the current file size exceeds this threshold.
     * @returns {RollingConfig} The current instance of RollingConfig.
     */
    with_size_threshold(size_threshold) {
        RollingSizeOptions.assert(size_threshold);
        this.#size_threshold = size_threshold;
        return this;
    }

    /**
     *  @param {RollingTimeOptions} time_threshold Roll/Create new file every time the current file size exceeds this threshold.
     * @returns {RollingConfig} The current instance of RollingConfig.
     * @throws {Error} If the time_threshold is not an instance of RollingTimeOptions.
     */
    with_time_threshold(time_threshold) {
        RollingTimeOptions.assert(time_threshold);
        this.#time_threshold = time_threshold;
        return this;
    }

    /**
     * @param {Object} json The json object to be parsed into {RollingConfig}.
     * @returns {RollingConfig} A new instance of RollingConfig with values from the json object.
     * @throws {Error} If the json is not an object.
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
     * @description The log level to be used.
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
     * @description The prefix to be used for the log file name.
     *
     * If the file prefix is `MyFilePrefix_` the log files created will have the name
     * `MyFilePrefix_2021-09-01.log`, `MyFilePrefix_2021-09-02.log` and so on.
     */
    #file_prefix = "Logtar_";

    constructor() {
        this.#rolling_config = RollingConfig.with_defaults();
    }

    /**
     * @returns {LogConfig} A new instance of LogConfig with default values.
     */
    static with_defaults() {
        return new LogConfig();
    }

    /**
     * @param {string} file_path The path to the config file.
     * @returns {LogConfig} A new instance of LogConfig with values from the config file.
     * @throws {Error} If the file_path is not a string.
     */
    static from_file(file_path) {
        const file_contents = fs.readFileSync(file_path);
        return LogConfig.from_json(JSON.parse(file_contents));
    }

    /**
     * @param {Object} json The json object to be parsed into {LogConfig}.
     * @returns {LogConfig} A new instance of LogConfig with values from the json object.
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
     * @returns {LogLevel} The current log level.
     */
    get level() {
        return this.#level;
    }

    /**
     * @param {LogLevel} log_level The log level to be set.
     * @returns {LogConfig} The current instance of LogConfig.
     * @throws {Error} If the log_level is not an instance of LogLevel.
     */
    with_log_level(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
        return this;
    }

    /**
     * @returns {RollingConfig} The current rolling config.
     */
    get rolling_config() {
        return this.#rolling_config;
    }

    /**
     * @param {RollingConfig} config The rolling config to be set.
     * @returns {LogConfig} The current instance of LogConfig.
     * @throws {Error} If the config is not an instance of RollingConfig.
     */
    with_rolling_config(config) {
        this.#rolling_config = RollingConfig.from_json(config);
        return this;
    }

    /**
     * @returns {String} The current max file size.
     */
    get file_prefix() {
        return this.#file_prefix;
    }

    /**
     * @param {string} file_prefix The file prefix to be set.
     * @returns {LogConfig} The current instance of LogConfig.
     * @throws {Error} If the file_prefix is not a string.
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
     * @returns {LogLevel} A new instance of LogLevel with default values.
     */
    static get Debug() {
        return this.#Debug;
    }

    /**
     * @returns {LogLevel} A new instance of LogLevel with default values.
     */
    static get Info() {
        return this.#Info;
    }

    /**
     * @returns {LogLevel} A new instance of LogLevel with default values.
     */
    static get Warn() {
        return this.#Warn;
    }

    /**
     * @returns {LogLevel} A new instance of LogLevel with default values.
     */
    static get Error() {
        return this.#Error;
    }

    /**
     * @returns {LogLevel} A new instance of LogLevel with default values.
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
     * @returns {Logger} A new instance of Logger with default values.
     * @description The default log level is `LogLevel.Info`.
     */
    static with_defaults() {
        return new Logger();
    }

    /**
     * @param {LogConfig} log_config The log config to be used.
     * @returns {Logger} A new instance of Logger with the specified log config.
     * @throws {Error} If the log_config is not an instance of LogConfig.
     */
    static with_config(log_config) {
        return new Logger(log_config);
    }

    constructor(log_config) {
        LogConfig.assert(log_config);
        this.#config = log_config;
    }

    /**
     * Get the current log level.
     *
     * @returns {LogLevel} The current log level.
     *
     * const logger = new Logger(LogLevel.Debug);
     * console.log(logger.level); // LogLevel.Debug
     * logger.level = LogLevel.Error; // throws error
     * logger.level = LogLevel.Debug; // works fine
     * logger.level = 0; // throws error
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
