import MatchModel from '../../../src/db/models/match';

const testMatchData = require('./data/match');

describe('Match Model', () => {
  const match = new MatchModel({
    team: '6326',
    data: testMatchData
  });

  it('should convert match to csv rows', () => {
    console.log(match.toCSV());
  });
});