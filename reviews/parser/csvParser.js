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

const photoParser = ((pathname, model, res) => {
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
      let obj = {}
      keys.map((key, index) => {
        obj[key] = currentArr[index];
      });

      obj.id = Number(obj.id);
      obj.review_id = Number(obj.review_id);

      insert.push(obj);
    }
    let toInsert = db.convertPhotos(insert);
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
    res.end(err);
  });

  readStream.on('close', () => {
    res.end('insertion complete');
  });
});






const charParser = (pathname, model, res) => {
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
          let currentArr = dataArr[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
            return string.replace(/"/g, '');
          })
          let obj = {}
          keys.map((key, index) => {
            obj[key] = currentArr[index];
          });
          obj.id = Number(obj.characteristic_id);
          obj.value = Number(obj.value);
          insert.push(obj);
        }
    }
    let toInsert = db.convertChars(insert);
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

const updateChars = async (pathname, model, res) => {

  let readStream = fs.createReadStream(pathname);
  let keys = [];
  let count = 0;

  readStream.on('data', async (data) => {
    readStream.pause();
    let insert = [];
    let dataArr = data.toString().split('\n');

      switch(count) {
        case 0:

          keys = dataArr[0].split(',');
          count++;

        default:

          for (let i = 1; i < dataArr.length -1 ; i++) {
            let currentArr = dataArr[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
              return string.replace(/"/g, '');
            })
            let obj = {}
            keys.map((key, index) => {
              obj[key] = currentArr[index];
            });
            obj.id = Number(obj.id);
            insert.push(obj);
          }
          await Promise.all(insert.map( async (obj)=> {

            await model.updateMany({id: obj.id}, {"$set": {name: obj.name, product_id: obj.product_id}})
          }))
          .then(() => {
            console.log(`${insert.length} records updated`);
            readStream.resume();
          })
      }
  });
  readStream.on('close', () => {
    res.send('update complete');
  });

  readStream.on('error', (err) =>{
    res.status(501).send(err);
  });
}

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
  ReviewParser,
  photoParser,
  charParser,
  updateChars,
}
