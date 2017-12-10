const fs = require('fs');

const args = process.argv.slice(2);

let paths = args;

const dirArg = args[0];

if (!dirArg) {
  console.log('ERROR: Please provide a folder of match data to merge.');
  process.exit(0);
}

if (dirArg.substring(0, 4) === 'dir=') {
  const dir = dirArg.substring(4, dirArg.length);
  paths = fs.readdirSync(dirArg.substring(4, dirArg.length))
    .filter((p) => p !== '.DS_Store')
    .map((p) => `${dir}/${p}`);
}

const databases = paths.map((path) => JSON.parse(fs.readFileSync(path)));

const matches = databases.reduce((mergedDbs, database) => {
  return mergedDbs.concat(database);
}, []);

// now we check for duplicate matches and reconcile the differences
const finalMatches = matches.reduce((final, match) => {

  // get all duplicates for the current match
  return final.findIndex((m) => m.id === match.id) === -1 ? final.concat(match) : final;
}, []);

fs.writeFileSync('matches.json', JSON.stringify(finalMatches));