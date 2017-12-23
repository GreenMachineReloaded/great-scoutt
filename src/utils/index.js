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