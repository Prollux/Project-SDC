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
    dataArr = data.toString().split('\n');
    debugger;
    if (keys.length === 0) {
      keys = dataArr[0].split(',');
    }
    console.log(dataArr[1].split(','));
    res.send(dataArr[1].replace(/"/g, '').split(','));
  });

  readStream.on('error', (err) => {
    res.end(err);
  });
};


module.exports = {
  csvParser,
}
