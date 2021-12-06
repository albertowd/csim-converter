const monster = require('./lib/monster');
const packageObj = require('../package.json');
const raceChrono = require('./lib/race-chrono');

console.info(`\n${packageObj.name} ${packageObj.version}`);
console.info(`${packageObj.description}\n\n`);

let returnCode = 0;
if (2 < process.argv.length) {
  for (const argIndex in process.argv) {
    if (1 < argIndex) {
      try {
        const csvFileName = process.argv[argIndex];
        const monsterFileName = csvFileName.replace('.csv', '.txt');
        console.debug(`File to parse: ${csvFileName}`);
        const csv = raceChrono.readFromCSVFile(csvFileName);
        const convertedCsv = raceChrono.toMonster(csv);
        monster.writeToFile(convertedCsv, monsterFileName);
        console.info(`Converted file: ${monsterFileName}`);
      } catch (err) {
        console.error(err);
        console.info('\n\n\n');
        returnCode = 1;
      }
    }
  }
} else {
  console.info(`Usage mode: ${packageObj.name}[.exe] FILE_PATH [...FILE_PATH]\n`);
  console.info('  FILE_PATH\tRace Chrono CSV file path.\n\n\n');
}

console.log('Press any key to continue...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, returnCode));
