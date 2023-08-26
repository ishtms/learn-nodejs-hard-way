const fs = require("node:fs/promises");
const path = require("node:path");

const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");
const { RollingTimeOptions } = require("./utils/rolling-options");
const { check_and_create_dir, get_caller_info } = require("./utils/helpers");

class Logger {
    /**
     * @type {LogConfig}
     */
    #config;

    /**
     * @type {fs.FileHandle}
     */
    #log_file_handle;

    /**
     * @param {LogLevel} log_level
     */
    constructor(log_config) {
        log_config = log_config || LogConfig.with_defaults();
        LogConfig.assert(log_config);
        this.#config = log_config;
        this.#init();
    }

    /**
     * Initializes the logger by setting up the process exit handlers.
     */
    #init() {
        process.on("exit", this.#setup_for_process_exit.bind(this));
        process.on("SIGINT", this.#setup_for_process_exit.bind(this));
        process.on("SIGTERM", this.#setup_for_process_exit.bind(this));
        // you can't catch SIGKILL
        //process.on("SIGKILL", this.#setup_for_process_exit.bind(this));
    }

    /**
     * Initializes the logger by creating the log file, and directory if they don't exist.
     */
    async init() {
        const log_dir_path = check_and_create_dir("logs");

        const file_name = this.#config.file_prefix + new Date().toISOString().replace(/[\.:]+/, "-") + ".log";
        this.#log_file_handle = await fs.open(path.join(log_dir_path, file_name), "a+");
    }

    
    /**
     * @param {number} signal The exit signal received by the process.
     */
    async #setup_for_process_exit(signal) {
        if (this.#log_file_handle.fd <= 0) return;

        this.critical(`Logger shutting down. Received signal: ${signal}`);
        await this.#log_file_handle.sync();
        await this.#log_file_handle.close();
        process.exit();
    }

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
     * Writes the given message to the log file.
     * @private
     * @param {string} message
     * @param {number} log_level
     */
    async #log(message, log_level) {
        if (log_level < this.#config.level || !this.#log_file_handle.fd) {
            return;
        }

        const date_iso = new Date().toISOString();
        const log_level_string = LogLevel.to_string(log_level)

        const log_message = `[${date_iso}] [${log_level_string}]: ${get_caller_info()} ${message}\n`;
        await this.#log_file_handle.write(log_message);
    }

    /**
     * @param {string} message
     */
    debug(message) {
        this.#log(message, LogLevel.Debug);
    }

    /**
     * @param {string} message
     */
    info(message) {
        this.#log(message, LogLevel.Info);
    }

    /**
     * @param {string} message
     */
    warn(message) {
        this.#log(message, LogLevel.Warn);
    }

    /**
     * @param {string} message
     */
    error(message) {
        this.#log(message, LogLevel.Error);
    }

    /**
     * @param {string} message
     */
    critical(message) {
        this.#log(message, LogLevel.Critical);
    }

    /** Getters */

    /**
     * @returns {LogLevel} The current log level.
     */
    get level() {
        return this.#config.level;
    }

    /**
     * @returns {string} The log file prefix
     */
    get file_prefix() {
        return this.#config.file_prefix;
    }

    /**
     * @returns {RollingTimeOptions}
     */
    get time_threshold() {
        return this.#config.rolling_config.time_threshold;
    }

    /**
     * @returns {RollingSizeOptions}
     */
    get size_threshold() {
        return this.#config.rolling_config.size_threshold;
    }
}

module.exports = { Logger };
