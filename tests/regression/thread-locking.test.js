import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import Collection from '../../src/db/collection';
import utils from '../../src/utils';

describe('Collection', () => {
  const collection = new Collection('test.json', ['sometestdata']);

  beforeAll(() => {
    sinon.stub(FileSystem, 'readFile').callsFake(() =>
      Promise.reject('file does not exist'));
    sinon.stub(FileSystem, 'writeToFile').callsFake(() =>
      Promise.resolve({ success: true }));
  });

  it('should properly release thread lock initializing file', () => {
    return Promise.seq([
      Promise.make((done) => collection.getAll().then(done)),
      Promise.make((done) => collection.getAll().then(done))
    ])
    .then((results) => {
      assert(results);
    });
  });

  afterAll(() => {
    FileSystem.readFile.restore();
    FileSystem.writeToFile.restore();
  });

});