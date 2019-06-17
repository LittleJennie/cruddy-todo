const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, id) => {
    // create file with the id as file name
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    // write the file with the text from line 10
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error creating file');
      } else {
        callback(null, { id, text });
      }
    });
  });

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading all files');
    } else {
      // create an array to store the file object
      var fileObjArr = [];

      // loop through files arr
      files.forEach((file) => {
        // create an object for each file and push to the new file array in line 23
        // grab id from files name --> trim to have only the first five characters
        var fileObj = {
          id: file.slice(0, -4),
          text: file.slice(0, -4)
        };
        fileObjArr.push(fileObj);
      });

      // then we use this new file array to pass in to cb
      callback(null, fileObjArr);
    }
  });

};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
