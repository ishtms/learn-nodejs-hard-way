// files.js

const fs = require("node:fs/promises");
const path = require("path");
async function read_file() {
  try {
    const logPath = path.join(__dirname, "config", "log_config.json");
    const stream = await (await fs.open(logPath)).readFile();
    const config = JSON.parse(stream);

    console.log('Log prefix is: "%s"', config.log_prefix);
  } catch (err) {
    console.error("Error occurred while reading file: %o", err);
  }
}

// We export the open_file function so that it can be used in other modules.
module.exports = read_file;
