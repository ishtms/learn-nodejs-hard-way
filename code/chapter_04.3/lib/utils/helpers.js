const fs_sync = require('node:fs');
const path = require('path')

/**
 * @returns {fs_sync.PathLike} O path para o diretório.
 */
function check_and_create_dir(path_to_dir) {
    const log_dir = path.resolve(require.main.path, path_to_dir);
    if (!fs_sync.existsSync(log_dir)) {
        fs_sync.mkdirSync(log_dir, { recursive: true });
    }

    return log_dir
}

/**
 * @returns {string} Os metadados da chamada ao analisar o rastreio de pilha.
 */
function get_caller_info() {
    const error = {};
    Error.captureStackTrace(error);

    const caller_frame = error.stack.split("\n")[4];

    const meta_data = caller_frame.split("at ").pop();
    return meta_data
}

module.exports = {
    check_and_create_dir,
    get_caller_info
}