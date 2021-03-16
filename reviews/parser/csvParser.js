const fs = require('fs');
const path = require('path');

const csvParser = (pathname, callback) => {
  // creates string
  fs.readFile(path.join(__dirname, pathname), 'utf8', (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(null, result);
    }
  })
};


module.exports = {
  csvParser,
}
