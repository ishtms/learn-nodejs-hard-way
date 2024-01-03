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

module.exports = {
    check_and_create_dir
}