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
    res.send(dataArr);
  });

  readStream.on('error', (err) => {
    res.end(err);
  });
};


module.exports = {
  csvParser,
}
