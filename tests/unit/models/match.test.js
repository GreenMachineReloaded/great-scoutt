import assert from 'assert';
import MatchModel from '../../../src/db/models/match';

const testMatchData = require('./data/match');

describe('Match Model', () => {
  const match = new MatchModel({
    team: '6326',
    number: 1,
    tournament: 0,
    matchId: '0-1',
    alliance: 'RED',
    comments: 'Wow, what a great team',
    data: testMatchData
  });

  it('should convert match to csv rows', () => {
    assert.strictEqual(match.toCSV(), '6326|0|1|0-1|RED|Wow, what a great team|30|15|30|10|2|10|20|30|10|20|40|15|20');
  });

  it('should return headers', () => {
    const expectedHeaders = 'team|tournament|number|matchId|alliance|comments|Alliance-specific Jewel remaining on platform|Glyph scored in Cryptobox|Glyph bonus for Cryptobox Key column|Robot parked in Safe Zone|Glyph scored in Cryptobox|Completed row of 3 in Cryptobox|Completed column of 4 in Cryptobox|Completed Cipher|Relic in Recovery Zone #1|Relic in Recovery Zone #2|Relic in Recovery Zone #3|Bonus for keeping Relic upright|Robot balanced on Balancing Stone';
    assert.strictEqual(MatchModel.getCSVHeaders(), expectedHeaders);
  });
});