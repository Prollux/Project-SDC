const db = require('../database/database.js');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
//path.join(__dirname, pathname)
let keys = [];
let partial = null;

const csvParser = ((pathname, model, res) => {
  // creates string
  let readStream = fs.createReadStream(pathname);

  readStream.on('data', (data) => {
    readStream.pause();
    let insert = [];
    let dataArr = data.toString().split('\n');

    if (keys.length === 0) {
      keys = dataArr[0].split(',');
      partial = [dataArr.pop()];
    }
    // } else {
    //   let newVals = (partial + dataArr[0]).split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
    //     return string.replace(/"/g, '');
    //    });
    //   partial = dataArr.pop();
    //   insert.push(generateObject(newVals, keys));
    //   partial = null;
    // }

    for (let i = 1; i < dataArr.length -1 ; i++) {
      let currentArr = dataArr[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
        return string.replace(/"/g, '');
      })
      let insertObj = generateObject(currentArr, keys);
      insert.push(insertObj);

    }
    let toInsert = db.convertAll(insert);

    db.insertAll(model, toInsert, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`inserted ${insert.length} documents into collection`)
        readStream.resume()
      }
    });
  });
    //readStream.resume();

  readStream.on('error', (err) => {
    res.end(err);
  });

  readStream.on('close', () => {
    res.end('insertion completed');
  });
});



// helper function


const generateObject = (arr, keys) => {
  let obj = {};

    keys.map((key, index) => {
      obj[key] = arr[index];
    });

    obj.id = Number(obj.id);
    obj.rating = Number(obj.rating);

    if (obj.recommend === 'false') {
      obj.recommend = false;
    } else {
      obj.recommend = true;
    }

    if (obj.reported === 'false') {
      obj.reported = false;
    } else {
      obj.reported = true;
    }

    if (!obj.response) {
      obj.response = null;
    }

    obj.helpfulness = Number(obj.helpfulness);

    return obj;
}


module.exports = {
  csvParser,
}
