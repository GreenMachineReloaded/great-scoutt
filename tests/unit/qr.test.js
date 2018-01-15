import assert from 'assert';
import { createTeam, createMatch } from '../../src/ui/transfer/helpers';

describe('qr object creation', () => {

  describe('create team', () => {
    const fields = [
      '1515800544367',
      'Team Name',
      '5678'
    ];

    it('should create a correct team object', () => {
      const team = createTeam(fields);
      assert.strictEqual(team.name, 'Team Name');
      assert.strictEqual(team.id, 1515800544367);
      assert.strictEqual(team.number, '5678');
    });
  });

  describe('create match', () => {
    const fields = [
      '5678',
      '0',
      '1',
      '0-1',
      'RED',
      'some interesting comments',
      '30',
      '25',
      '15',
      '50',
      '100',
      '75',
      '0',
      '5',
      '60',
      '125',
      '80',
      '65',
      '25'
    ];
    it('should create a correct match object', () => {
      const match = createMatch(fields);
      assert.strictEqual(match.team, '5678');
      assert.strictEqual(match.tournament, 0);
      assert.strictEqual(match.number, 1);
      assert.strictEqual(match.matchId, '0-1');
      assert.strictEqual(match.alliance, 'RED');
      assert.strictEqual(match.comments, 'some interesting comments');
      assert.strictEqual(match.data.categories[0].rules[0].points, 30);
    });
  });

});