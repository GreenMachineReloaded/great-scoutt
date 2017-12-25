import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import Collection from './collection';
import utils from '../utils';

describe('Collection', () => {

  beforeAll(() => sinon.stub(FileSystem, 'writeToFile').callsFake(() => Promise.resolve({ success: true })))

  describe('init', () => {
    const collection = Collection('test.json', ['sometestdata']);

    beforeAll(() => sinon.stub(FileSystem, 'readFile').callsFake(() => Promise.resolve('[]')));

    it('should initialize with provided data', () => {
      return collection.getAll()
        .then((data) => {
          assert(data.length === 1);
          assert(data[0] === 'sometestdata');
        });
    });

    afterAll(() => FileSystem.readFile.restore());

  });

  describe('#add', () => {
    
    describe('when there are no items in collection', () => {
      const collection = Collection('test.json', []);
    
      beforeAll(() => sinon.stub(FileSystem, 'readFile').callsFake(() => Promise.resolve('[]')));
  
      it('should successfully create a new item', () => {
        return Promise.seq([
          Promise.make((done) => collection.add('new item').then(done)),
          Promise.make((done) => collection.getAll().then(done))
        ])
        .then(([addResult, items]) => {
          assert(addResult === 'new item', 'expected result of collection.add to be the added item');
          assert(items.length === 1,`expected database to have only 1 item, but it has ${items.length}`);
          assert(items[0] === 'new item', 'expected first item in database to be "new item');
        })
        .catch(assert.fail);
      });
  
      afterAll(() => FileSystem.readFile.restore());

    });

  });

  afterAll(() => FileSystem.writeToFile.restore());

});