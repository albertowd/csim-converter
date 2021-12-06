const fs = require('fs');

const csvParse = require('csv-parse/sync');

// Race Chrono v7.4.1
const CSV_HEADERS = {
  LAP_NUMBER: 'Lap #',
  TIMESTAMP_S: 'Timestamp (s)',
  DISTANCE_M: 'Distance (m)',
  DISTANCE_KM: 'Distance (km)',
  LOCKED_SATS: 'Locked satellites',
  LAT_DEG: 'Latitude (deg)',
  LON_DEG: 'Longitude (deg)',
  SPEED_MS: 'Speed (m/s)',
  SPEED_KMH: 'Speed (km/h)',
  SPEED_MPH: 'Speed (mph)',
  ALTITUDE_M: 'Altitude (m)',
  BEARING_DEG: 'Bearing (deg)',
  LONG_ACC_G: 'Longitudinal Acceleration (G)',
  LAT_ACC_G: 'Lateral Acceleration (G)',
  X_POS_M: 'X-position (m)',
  Y_POS_M: 'Y-position (m)',
  RPM: 'RPM (rpm)',
  THROTTLE_POS: 'Throttle Position (%)',
  TRAP_NAME: 'Trap name',
};


/**
 * Tries to read the Race Chrono CSV format from a file to a array of lines as objects.
 * @param {string} csvFilePath CSV file path to read from.
 * @param {string} delimiter CSV file delimiter, default to ','.
 * @param {string} encoding CSV encoding format, default to 'utf-8'.
 * @throws {Error} If any read or parse error occurred during the routine.
 * @return {Array<any>} A data array of lines containing key => values.
 */
function readFromCSVFile(csvFilePath, delimiter = ',', encoding = 'utf-8') {
  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`Race Chrono CSV file already does not exists: '${filePath}'.`);
  } else {
    console.info(`Reading Race Chrono CSV file from: '${csvFilePath}' (${encoding}).`);
  }

  let parsedCsv;
  try {
    const csvContent = fs.readFileSync(csvFilePath).toString(encoding);
    parsedCsv = csvParse.parse(csvContent, {
      columns: true, // Returns each line as an object.
      delimiter,
      fromLine: 11, // The Race Chrono CSV file has 10 information lines before it really starts.
    });
  } catch (err) {
    throw new Error(`Error reading Race Chrono CSV file: ${err.message}.`);
  }

  console.debug(`Race Chrono CSV file parsed ${parsedCsv.length} line(s).`);
  console.info('Validating CSV file...');
  validateCsv(parsedCsv);
  return parsedCsv;
}

/**
 * Converts a Race Chrono CSV data array to a Monster data array.
 * @param {Array<any>} dataArray A data array of lines containing key => values.
 * @return {Array<Array<string>>} A converted data array of lines with an array of values.
 */
function toMonster(dataArray) {
  const convertedDA = [];
  // Each line has the distance delta from the first CSV distance value.
  const distanceDelta = 0 < dataArray.length ? parseFloat(dataArray[0][CSV_HEADERS.DISTANCE_M]) : 0;
  console.info(`Converting from Race Chrono CSV data to Monster data: ${distanceDelta.toFixed(3)}m as the first lap distance.`);
  for (const line of dataArray) {
    convertedDA.push([
      (parseFloat(line[CSV_HEADERS.DISTANCE_M]) - distanceDelta).toFixed(3),
      line[CSV_HEADERS.RPM] || '0', // Could be undefined
      line[CSV_HEADERS.LAT_ACC_G],
      line[CSV_HEADERS.LONG_ACC_G],
      '0', // Famp front left (mm)
      '0', // Damp front right (mm)
      '0', // Damp rear left (mm)
      '0', // Damp rear right (mm)
      '0', // Steering angle (degree)
      '0', // Throtle position (%)
      line[CSV_HEADERS.SPEED_KMH],
    ]);
  }
  return convertedDA;
}

/**
 * Validates the data array of a Race Chrono CSV file.
 * @param {Array<any>} dataArray A data array of lines containing key => values.
 * @throws {Error} If any line has the wrong column number.
 */
function validateCsv(dataArray) {
  const errors = [];
  const headerCount = Object.keys(CSV_HEADERS).length;
  // eslint-disable-next-line guard-for-in
  for (const lineIndex in dataArray) {
    const line = dataArray[lineIndex];
    const lineCount = Object.keys(line).length;
    if (headerCount !== lineCount) {
      errors.push(`Wrong column count (${lineCount}) on line ${lineIndex + 1}, should contain ${headerCount} columns.`);
    }
  }
  if (0 < errors.length) {
    throw new Error(`Errors validating Race Chrono CSV file:\n\t${errors.join('\n\t')}`);
  }
}

module.exports = {
  readFromCSVFile,
  toMonster,
  validateCsv,
};
