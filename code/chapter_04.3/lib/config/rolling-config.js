const { RollingTimeOptions, RollingSizeOptions } = require("../utils/rolling-options");

class RollingConfig {
    /**
     * Roll/Create new file every time the current file size exceeds this threshold in `seconds`.
     *
     * @type {RollingTimeOptions}
     * @private
     *
     */
    #time_threshold = RollingTimeOptions.Hourly;

    /**
     * @type {RollingSizeOptions}
     * @private
     */
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
     * @param {time_threshold} time_threshold Roll/Create new file every time the current file size exceeds this threshold.
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

    /**
     * @returns {RollingTimeOptions} The current time threshold.
     */
    get time_threshold() {
        return this.#time_threshold;
    }

    /**
     * @returns {RollingSizeOptions} The current size threshold.
     */
    get size_threshold() {
        return this.#size_threshold;
    }
}

module.exports = { RollingConfig };
