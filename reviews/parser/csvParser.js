const fs = require('fs');
const path = require('path');
//path.join(__dirname, pathname)

const csvParser = (pathname, res) => {
  // creates string
  let readStream = fs.createReadStream(path.join(__dirname, pathname));
  readStream.on('open', () => {
    readStream.pipe(res);
  });

  readStream.on('error', (err) => {
    res.end(err);
  });
};


module.exports = {
  csvParser,
}
