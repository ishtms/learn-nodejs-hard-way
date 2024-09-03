const encodedMap = {
  "3A": ":",
  "2F": "/",
  "3F": "?",
  23: "#",
  "5B": "[",
  "5D": "]",
  40: "@",
  21: "!",
  24: "$",
  26: "&",
  27: "'",
  28: "(",
  29: ")",
  "2A": "*",
  "2B": "+",
  "2C": ",",
  "3B": ";",
  "3D": "=",
  25: "%",
  20: " ",
};

function fastDecode(string) {
  let result = "";
  let lastIndex = 0;
  let index = string.indexOf("%");

  while (index !== -1) {
    result += string.substring(lastIndex, index);
    const hexVal = string.substring(index + 1, index + 3);
    result += encodedMap[hexVal] || "%" + hexVal;
    lastIndex = index + 3;
    index = string.indexOf("%", lastIndex);
  }

  return result + string.substring(lastIndex);
}

module.exports = { fastDecode };
