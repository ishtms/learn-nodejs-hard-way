const { RollingTimeOptions, RollingSizeOptions } = require("../utils/rolling-options");

class RollingConfig {
    /**
     * Rotaciona/Cria um novo arquivo toda vez que o tamanho atual do arquivo exceder este limite em `segundos`.
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
     * @param {time_threshold} time_threshold Rotaciona/Cria um novo arquivo toda vez que o tempo de criação do arquivo atual exceder este limite.
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

module.exports = { RollingConfig };
