import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';

export function assertProps (actual, expected, path='root.') {
  const actualProps = Object.keys(actual);
  const expectedProps = Object.keys(expected);

  // doing 2 asserts here because if you are just missing a property this first
  // assert is a bit clearer
  assert.deepEqual(actualProps, expectedProps);
  expectedProps.forEach((prop) => {
    if (typeof expected[prop] === 'object') {

      // if this is an object, step into it
      assertProps(actual[prop], expected[prop], path + `${prop}.`);
    } else {
      assert(actual[prop] === expected[prop], `expected ${path + prop} === ${expected[prop]} NOT ${path + prop} === ${actual[prop]}`);
    }
  });
}

export function stubReadFile (data) {
  sinon.stub(FileSystem, 'readFile').callsFake(() => {
    return Promise.resolve(JSON.stringify(data))
  });
}

export function unStubReadFile () {
  FileSystem.readFile.restore();
}

export function stubWriteToFile () {
  sinon.stub(FileSystem, 'writeToFile').callsFake(() => {
    return Promise.resolve({ success: true })
  });
}

export function unStubWriteToFile () {
  FileSystem.writeToFile.restore();
}

let teamCounter = 0;

export function createTeam (number) {
  return {
    id: Date.now(),
    name: `Team ${teamCounter++}`,
    number: number || `${Math.round(Math.random() * 20000)}`
  };
}

/**
 * Extension to Promise library that resolves promises in order. Does not pass thru result values!
 * @param {array} promises an array of promises
 * @param {array} results resolved values of promises
 */
Promise.seq = function (promises, results=[]) {
  if (promises.length === 0) {
    return Promise.resolve(results);
  }

  return promises[0]().then((value) => {
    const nextResults = results;
    nextResults.push(value);
    return Promise.seq(promises.slice(1), nextResults);
  });
};

Promise.make = function (cb) {
  return () => new Promise(cb);
};