const db = require('../database/database.js');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
//path.join(__dirname, pathname)
let keys = [];
let partial = null;

const ReviewParser = ((pathname, model, res) => {
  // creates string
  let readStream = fs.createReadStream(pathname);

  readStream.on('data', (data) => {
    readStream.pause();
    let insert = [];
    let dataArr = data.toString().split('\n');

    if (keys.length === 0) {
      keys = dataArr[0].split(',');
    }

    for (let i = 1; i < dataArr.length -1 ; i++) {
      let currentObj = JSON.parse(dataArr[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
      insert.push(currentObj);

    }
    let toInsert = db.convertReviews(insert);
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



const metaParser = (pathname, model, res) => {
  let readStream = fs.createReadStream(pathname);
  let keys = [];
  let count = 0;

  readStream.on('data', (data) => {
    readStream.pause();

    let insert = [];
    let dataArr = data.toString().split('\n');

    switch(count) {
      case 0:

        keys = dataArr[0].split(',');
        count++;

      default:

        for (let i = 1; i < dataArr.length -1 ; i++) {
          let currentObj = JSON.parse(dataArr[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
          insert.push(currentObj);
        }
    }
    let toInsert = db.convertMeta(insert);
    db.insertAll(model, toInsert, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`inserted ${insert.length} documents into collection`)
        readStream.resume();
      }
    });
  });

  readStream.on('error', (err) => {
    res.send(err);
  });

  readStream.on('close', () => {
    res.send('insertion complete');
  })
}


module.exports = {
  ReviewParser,
  metaParser,
}
