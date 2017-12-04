import mocha from 'mocha';
import assert from 'assert';
import fs from 'fs';
import JsonClient from '../db-client';

// Some test data is preloaded in this file. Be careful if you modify it and
// make sure you run these tests frequently
const TEST_DATA_PATH = './services/tests/data/test-data.json';
const testData = JSON.parse(fs.readFileSync(TEST_DATA_PATH));

const items = new JsonClient('./services/tests/data/test-data.json');

describe('DbClient', () => {
  // Uses item with id = 0
  it('should get an item by id', () => {
    const TEST_ITEM_ID = 0;
    assert.ok(items.getById(TEST_ITEM_ID).id === 0);
  });

  it('should get all the items', () => {
    assert.ok(items.getAll().length === testData.length);
  });

  it('should filter items', () => {
    const results = items.filter({
      hasHamburger: true
    });

    assert.ok(results.length === 1);
  });

  it('should add an item', () => {
    const newItem = {
      field: 'myField'
    };

    const createdItem = items.add(newItem);

    assert.ok(createdItem.id !== undefined, 'id of new item should not be undefined');
    assert.ok(createdItem.field === 'myField', 'should have the field set on the newItem');
    assert.ok(items.getById(createdItem.id), 'new item should be present in the client\'s data store');
  });

  it('should remove an item', () => {
    const TEST_ITEM_ID = 0;
    assert.ok(items.remove(TEST_ITEM_ID) === TEST_ITEM_ID);
    assert.ok(items.getById(TEST_ITEM_ID) === undefined);
  });

  // Uses item with id = 1
  it('should update an item', () => {
    const TEST_ITEM_ID = 1;
    const result = items.update(TEST_ITEM_ID, {
      newField: 'wow'
    });

    assert.ok(result.id === 1);
    assert.ok(result.newField === 'wow');
  });

  it('should save changes', () => {
    const testItems = [
      {
        field: 'test'
      },
      {
        field: 'test'
      }
    ];

    items.clear()

    // add each test item
    testItems.forEach((item) => {
      items.add(item);
    });

    items.save();
    const data = require('./data/test-data.json');
    savedItems = data.filter((savedItem) => savedItem.field === 'test');
    assert.ok(savedItems.length === 2);
  });

  it('should throw an error if no path is provided', () => {
    try {
      // We don't need to capture the actual object, just make sure it throws an error
      new JsonClient();
      assert.fail(true, 'this assert should not be executed. Make sure you are throwing an error properly.');
    } catch (e) {
      assert.ok(e);
    }
  });

  after(() => {
    // Restore test data to orginial state
    fs.writeFileSync(items.path, JSON.stringify(testData, null, '  '));
  });
});
