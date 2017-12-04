import mocha from 'mocha';
import sinon from 'sinon';
import assert from 'assert';
import DbClient from '../db-client';
import TeamService from '../team-service';

describe('Team Service', () => {
  it('should request all teams', () => {
    const stub = sinon.stub(DbClient.prototype, 'getAll');
    const teams = new TeamService();

    teams.getAll();
    assert.ok(stub.calledOnce);

    stub.restore();
  });

  it('should request a team with a given number', () => {
    const stub = sinon.stub(DbClient.prototype, 'filter');
    const teams = new TeamService();

    teams.getByNumber(4318);
    assert.ok(stub.calledWith({ number: 4318 }));

    stub.restore();
  });

  it('should send a request to make a new team', () => {
    const stub = sinon.stub(DbClient.prototype, 'add');
    const teams = new TeamService();
    const newTeamObject = {
      number: 4318,
      name: 'Green Machine Reloaded'
    };

    teams.create(newTeamObject);

    // TODO: deep comparision here instead of surface comparision
    assert.ok(stub.calledWith(newTeamObject));

    stub.restore();
  });

  it('should request to update a team with a given number', () => {
    // Return an id from the dbclient given a team nuber
    const id = 0;
    const getByNumberStub = sinon.stub(TeamService.prototype, 'getByNumber').callsFake(() => ({ id }));
    const dbUpdateStub = sinon.stub(DbClient.prototype, 'update');
    const teams = new TeamService();
    const newTeamData = { name: 'This is a new team' };

    teams.update(4318, newTeamData);
    assert.ok(dbUpdateStub.calledWith(id, newTeamData));

    getByNumberStub.restore();
    dbUpdateStub.restore();
  });

  it('should request to delete a team', () => {
    const id = 0;
    const getByNumberStub = sinon.stub(TeamService.prototype, 'getByNumber').callsFake(() => ({ id }));
    const dbRemoveStub = sinon.stub(DbClient.prototype, 'remove');
    const teams = new TeamService();

    teams.delete(4318);
    assert.ok(dbRemoveStub.calledWith(id));

    getByNumberStub.restore();
    dbRemoveStub.restore();
  });
});
