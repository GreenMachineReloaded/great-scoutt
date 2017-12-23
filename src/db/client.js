import Collection from './collection';

let instance;

/**
 * Exports an object with fields representing the domain objects.
 * Think of this file sort of as a subsitute for setting up
 * database contraints
 */
function Client () {
  if (!instance) {
    const newMatchCollection = new Collection('matches.json', []);
    const newTeamCollection = new Collection('teams.json', []);
    const matchCollection = setupMatchCollection(newMatchCollection, newTeamCollection);
    const tournamentCollection = new Collection('tournaments.json', require('../data/tournaments'));
    const settingsCollection = new Collection('settings.json', require('../data/settings'));

    instance = {
      matchCollection: matchCollection,
      teamCollection: setupTeamCollection(newTeamCollection, matchCollection),
      tournamentCollection: tournamentCollection,
      settingsCollection: settingsCollection
    };
  }

  return instance;
}

// setup methods allow you put some middleware in front of a db request. This
// allows creating constraints on db ops, some of which might create cyclic
// dependency issues otherwise

// TODO: bind setupMethod this to collection and change these override methods to arrow funcs?
function setupTeamCollection (collection, matchCollection) {
  return {
    getAll: collection.getAll.bind(collection),
    getById: collection.getById.bind(collection),
    find: collection.find.bind(collection),
    filter: collection.filter.bind(collection),
    add: collection.add.bind(collection),
    update: collection.update.bind(collection),

    // check if team is contained in any matches
    remove: ((teamId) => {
      return collection.find(({ id }) => id === teamId)
        .then(({ number }) => matchCollection.find((match) => match.team === number))
        .then((match) => {
          if (match) {
            return Promise.reject({
              name: 'DbDeleteOpError',
              message: 'This team cannot be deleted because it has match data.'
            });
          }

          return collection.remove(teamId);
        });
    }).bind(collection),

    clear: collection.clear.bind(collection),
    save: collection.save.bind(collection),
    reload: collection.reload.bind(collection)
  };
}

function setupMatchCollection (collection, teamCollection) {
  return {
    getAll: collection.getAll.bind(collection),
    getById: collection.getById.bind(collection),
    find: collection.find.bind(collection),
    filter: collection.filter.bind(collection),

    add: ((match) => {
      if (match.number < 1) {
        return Promise.reject({
          name: 'DbSchemaError',
          message: 'Match number must be greater than 0.'
        });
      } else {
        return collection.add(Object.assign(match, { matchId: `${match.tournament}-${match.number}` }));
      }
    }).bind(collection),

    update: collection.update.bind(collection),
    remove: collection.remove.bind(collection),
    clear: collection.clear.bind(collection),
    save: collection.save.bind(collection)
  };
}

export default Client;
