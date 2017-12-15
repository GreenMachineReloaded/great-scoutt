// 1. get path to matches.json file
// 2. load json
// 3. for each match, create a formatted string representating it
// 4. output these into seperate documents in a target directory

const fs = require('fs');

const args = process.argv.slice(2);

const matchFilePath = args[0];
const outputDir = args[1];

const matches = JSON.parse(fs.readFileSync(matchFilePath));

matches.forEach((match) => {
    const textMatch = [
        `Team #: ${match.team}`,
        `Match #: ${match.number}`,
        `Tournament Id: ${match.tournament}`,
        `Alliance: ${match.alliance}`,
        match.data.categories.reduce((out, category) => {
            let catHeader = `${category.name}`;
            const rules = category.rules.reduce((accumRules, rule) => {
                return accumRules += `${rule.name}: ${rule.points}\n`
            }, '');
            return out += `${catHeader}\n${rules}\n`;
        }, '')
    ].join('\n');

    fs.writeFileSync(outputDir + `/${match.team}_${match.matchId}`, textMatch);
});