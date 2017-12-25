import FileSystem from 'react-native-filesystem-v1';

let loading = {};

/**
 * Starts up the database
 * @param  {string} path     path to data file
 * @param  {array}  initData array of objects to initialize with (if null will load current db from path)
 */
function Collection (path='', initData=[], autoSave=false) {
  if (!path.length) {
    throw new Error('Please provide a path for the database...');
  }

  const self = {
    data: null
  };

  function getData () {
    
    // check if this file path is currently being loaded
    if (loading[path]) {
      
      // if so, wait 20 ms and try getting it again
      return new Promise((done) => setTimeout(() => getData().then(done), 10));
    }
  
    // if our data object is not initialized, do so
    if (self.data === null) {
      loading[path] = true;
      return FileSystem.readFile(path, FileSystem.storage.extBackedUp)
        .then((rawText) => {
          try {
            const d = JSON.parse(rawText);
            self.data = d.length ? d : initData;
            loading[path] = false;
  
            // if there is no data on disk, we need to save our preset data
            if (!self.data) {
              save();
            }
          } catch (e) {
            throw new Error('failed parsing json file: ' + path)
          }
  
          return self.data;
        })
        .catch((error) => {
          self.data = initData;
          return save().then(() => {
            loading[path] = false;
            return Promise.resolve(self.data);
          });
        });
    }
  
    return Promise.resolve(self.data);
  }

  function getAll () {
    return getData();
  }

  function getById (id) {
    return getData().then((data) => data.find((item) => item.id === id))
  }

  function find (searchFunc) {
    return getData().then((data) => data.find(searchFunc))
  }

  function filter (params) {

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

    return getData()
      .then((data) => data.filter((item) => hasValues(params, item)));

  }

  function add (item) {
    // TODO: make a better id generator
    const itemWithId = item;
    itemWithId.id = Date.now();
    return getData()
      .then((data) => {
        self.data = data.concat(itemWithId);
        return save();
      })
      .then(() => itemWithId);
  }

  // updates the item with the provided id to have the fields with values in
  // modifiedFields. if an id field is included it will be deleted
  function update (id, modifiedFields) {
    // modifiying the argument because I REALLY don't want you to put an id on this
    if (modifiedFields.id !== undefined) {
      delete modifiedFields.id;
    }

    return getData()
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
        self.data = data;
        return save();
      });
  }

  function remove (id) {
    return getData()
      .then((data) => {
        self.data = data.filter((item) => item.id !== id);
        return save();
      });
  }

  function clear (id) {
    self.data = [];
    return save();
  }

  function save () {
    
    // if there is no data currently loaded, initialize it to an empty array and
    // write that out
    let dataToWrite = self.data;
    if (!dataToWrite) {
      dataToWrite = [];
      self.data = dataToWrite;
    }
  
    return FileSystem.writeToFile(path, JSON.stringify(dataToWrite), false, FileSystem.storage.extBackedUp);
  }

  function reload () {
    self.data = null;
  }

  return {
    getData,
    getAll,
    getById,
    find,
    filter,
    add,
    update,
    remove,
    clear,
    save,
    reload
  };
};

export default Collection;
