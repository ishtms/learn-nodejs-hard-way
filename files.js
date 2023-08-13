const fs = require("node:fs/promises");

async function open_file() {
  try {
    const file_handle = await fs.open("config", "r", fs.constants.O_WRONLY);
    // do something with the `file_handle`
  } catch (err) {
    // Do somethign with the `err` object
  }
}

module.exports = open_file;
