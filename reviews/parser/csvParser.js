const fs = require('fs');
const path = require('path');
//path.join(__dirname, pathname)
let keys = [];

const csvParser = (pathname, res) => {
  // creates string
  let readStream = fs.createReadStream(pathname);
  readStream.on('data', (data) => {
    //readStream.pipe(res);
    readStream.pause();
    let dataArr = data.toString().split('\n');
    debugger;
    if (keys.length === 0) {
      keys = dataArr[0].split(',');
    }
    let obj = {};
    let currentArr = dataArr[1].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
     return string.replace(/"/g, '');
    })

    keys.map((key, index) => {
      obj[key] = currentArr[index];
    });
    debugger;

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

    if (obj.response.length === 0) {
      obj.response = null;
    }

    obj.helpfulness = Number(obj.helpfulness);

    res.send(obj);
  });

  readStream.on('error', (err) => {
    res.end(err);
  });
};


module.exports = {
  csvParser,
}
