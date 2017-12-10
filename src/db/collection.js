import FileSystem from 'react-native-filesystem-v1';

// TODO: this implements an interface for a real database client, but it just
// interacts with JSON right now. Replace this with a real DB at some point

/**
 * Starts up the database
 * @param  {string} path     path to data file
 * @param  {array}  initData array of objects to initialize with (if null will load current db from path)
 */
function Collection (path='', initData=null, autoSave=false) {
  if (!path.length) {
    throw new Error('Please provide a path for the database...');
  }

  this.path = path;
  this.autoSave = autoSave;
  this.data = initData;
};

Collection.prototype.getData = function () {
  if (!this.data) {
    console.log(`Reading from ${this.path}`);
    return FileSystem.readFile(this.path, FileSystem.storage.extBackedUp)
      .then((rawText) => {
        try {
          this.data = JSON.parse(rawText);
        } catch (e) {
          throw new Error('failed parsing json file: ' + this.path)
        }
        
        return this.data || [];
      })
      .catch((error) => {
        console.log('FileError!', error.message);
        return this.save().then(() => Promise.resolve(this.data));
      });
  }

  return Promise.resolve(this.data);
};

// GET ALL THE THINGS
Collection.prototype.getAll = function () {
  return this.getData();
};

// get an item by id
Collection.prototype.getById = function (id) {
  return this.getData().then((data) => data.find((item) => item.id === id));
};

Collection.prototype.find = function (searchFunc) {
  return this.getData().then((data) => data.find(searchFunc));
};

// finds all items matching the provided params
Collection.prototype.filter = function (params) {

  // check if b hasValues of a
  function hasValues (a, b) {
    const aKeys = Object.keys(a);
    let isResult = true;
    aKeys.forEach((key) => {
      if (b[key] !== a[key]) {
        isResult = false;
      }
    });

    return isResult;
  }

  return this.getData()
    .then((data) => data.filter((item) => hasValues(params, item)));
};

// add a new team
Collection.prototype.add = function (item) {

  // TODO: make a better id generator
  const itemWithId = item;
  itemWithId.id = Date.now();
  return this.getData()
    .then((data) => {
      this.data = data.concat(itemWithId);
      return this.save();
    })
    .then(() => itemWithId);
};

// updates the item with the provided id to have the fields with values in
// modifiedFields. if an id field is included it will be deleted
Collection.prototype.update = function (id, modifiedFields) {

  // modifiying the argument because I REALLY don't want you to put an id on this
  if (modifiedFields.id !== undefined) {
    delete modifiedFields.id;
  }

  return this.getData()
    .then((data) => {
      const currentItemIndex = data.findIndex((item) => item.id === id);
      if (currentItemIndex < 0) {
        return Promise.reject({
          name: 'DbUpdateOpError',
          message: 'Cannot find index for item to modify'
        });
      }
      const currentItem = data[currentItemIndex];
      const mergedItem = Object.assign(currentItem, modifiedFields);
      data[currentItemIndex] = mergedItem;
      this.data = data;
      return this.save();
    });
}

// DESTROY
Collection.prototype.remove = function (id) {
  return this.getData().then((data) => {
    this.data = data.filter((item) => item.id !== id);
    return this.save();
  });
};

// NO REALLY, DESTROY
Collection.prototype.clear = function (id) {
  this.data = [];
  return this.save();
};

// save the current db state
Collection.prototype.save = function () {

  // if there is no data currently loaded, initialize it to an empty array and
  // write that out
  let dataToWrite = this.data;
  if (!dataToWrite) {
    dataToWrite = [];
    this.data = dataToWrite;
  }

  return FileSystem.writeToFile(this.path, JSON.stringify(dataToWrite), false, FileSystem.storage.extBackedUp);
};

export default Collection;
