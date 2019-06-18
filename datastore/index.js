const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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
  var readFile = Promise.promisify(fs.readFile);

  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      throw ('error reading all files');
    } else {
      // files => an array of the file names => ['01.txt', '02.txt']
      // first to sanitize this array to ['01', '02']
      var fileIds = fileNames.map((fileName) => {
        return fileName.slice(0, -4);
      });
      
      // set up a object array for the files
      // read each file using the id --> within each read, need to populate the text in the individual object
      var fileObjArr = fileIds.map( (id) => {
        return readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8')
          .then ((filedata) => (
            {
              id: '001', 
              text: filedata
            }
          ));
      });
      // at the really end, we call callback function with the result of this object array
      Promise.all(fileObjArr).then( 
        () => {
          console.log(fileObjArr);
          callback(null, fileObjArr);
        }
      );
    }
  });

};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback (new Error(`No item with id: ${id}`));
    } else {
      callback (null, { id: id, text: fileData});
    }
  });

};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  var filePath = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(id);
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


// // create an array to store the file object
// var fileNameObjArr = [];

// // loop through files arr
// files.forEach((fileName) => {
//   // create an object for each file and push to the new file array in line 23
//   // grab id from files name --> trim to have only the first five characters
//   var id = fileName.slice(0, -4);
//   var filePath = path.join(exports.dataDir, `${id}.txt`);

//   var createFileObj = (filedata) => {
//     var obj = {
//       id: fileName.slice(0, -4),
//       text: filedata
//     }
//     fileNameObjArr.push(obj);
//   }

//   readFile(filePath)
//     .then( // should generate the content of the file
//       (filedata) => {createFileObj(filedata)}
//     )
// });

// // then we use this new file array to pass in to cb
// console.log(fileNameObjArr)
// callback(null, fileNameObjArr);