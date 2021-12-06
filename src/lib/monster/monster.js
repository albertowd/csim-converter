const fs = require('fs');

const HEADERS = [
  'lap distance (m)',
  'rpm',
  'ay (g)',
  'ax (g)',
  'damper front left (mm)',
  'damper front right (mm)',
  'damper rear left (mm)',
  'damper rear right (mm)',
  'steering angle (deg)',
  'throtle position (%)',
];

const OPTIONAL_HEADERS = [
  'strain front left (kgf)',
  'strain front right (kgf)',
  'strain rear left (kgf)',
  'strain rear right (kgf)',
];

/**
 * Convert a data array containing an array of values for each line into a formatted monster file string.
 * @param {Array<Array<string>>} dataArray Data array with lines and values.
 * @throws {Error} If the source data array does not have the required values.
 * @return {string} Formatted monster file string.
 */
function toString(dataArray) {
  const lines = [];
  // eslint-disable-next-line guard-for-in
  for (const lineIndex in dataArray) {
    const line = dataArray[lineIndex];
    if (HEADERS.length > line.length) {
      throw new Error(`Data array does not have the minimum column count on line ${lineIndex + 1}: ${line.length} of ${HEADERS.length} columns required.`);
    }
    lines.push(line.join('\t'));
  }
  return lines.join('\n');
}

/**
 * Tries to write the contents of the data array into the target file path.
 * @param {Array<Array<string>>} dataArray Data array with lines and values.
 * @param {string} filePath Target file path to write monster content.
 * @throws {Error} If could not write file.
 */
function writeToFile(dataArray, filePath) {
  if (fs.existsSync(filePath)) {
    console.warn(`Monster file already exists, file '${filePath}' will be overwritten.`);
  } else {
    console.info(`Writing monster file to: ${filePath}`);
  }

  console.debug(`Monster file contains ${dataArray.length} lines.`);
  try {
    fs.writeFileSync(filePath, toString(dataArray));
  } catch (err) {
    throw new Error(`Error writting monster file: ${err.message}`);
  }
}

module.exports = {
  HEADERS,
  OPTIONAL_HEADERS,
  toString,
  writeToFile,
};
