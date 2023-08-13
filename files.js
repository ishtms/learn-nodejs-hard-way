const fs = require("node:fs/promises");

async function openFile() {
  const fileHandle = await fs.open(
    "calculator.js",
    "r",
    fs.constants.O_RDONLY | fs.constants.O_WRONLY
  );
  const fileHandle2 = await fs.open(
    "calculator.js",
    "r",
    fs.constants.O_RDONLY | fs.constants.O_WRONLY
  );
  console.log(await fileHandle2.fd);
}

module.exports = openFile;

/**
FileHandle {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  close: [Function: close],
  [Symbol(kCapture)]: false,
  [Symbol(kHandle)]: FileHandle {},
  [Symbol(kFd)]: 20,
  [Symbol(kRefs)]: 1,
  [Symbol(kClosePromise)]: null
}
 */
