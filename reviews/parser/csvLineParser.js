const homedir = require('os').homedir();
const reviewsDir = `${homedir}/Desktop/reviews.csv`;

const lineParser = (filepath, res) => {

  let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(reviewsDir)
});
  let keys = null;
  lineReader.on('line', function (line) {
    lineReader.input.pause();
    let obj = {};
    if (!keys) {
      keys = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
        return string.replace(/"/g, '');
      });
    } else {
      currentData = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(string => {
        return string.replace(/"/g, '');
      });
      keys.map((key, index) => {
        obj[key] = currentData[index]})

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

        if (obj.response.length === 0 || obj.response === 'null') {
          obj.response = null;
        }
        console.log(obj);
        res.send(obj);
    }
  });
}

module.exports = {
  lineParser,
}