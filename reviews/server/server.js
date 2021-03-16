const express = require('express');
const server = express();
const port = 3080;
const parse = require('../parser/csvparser.js');
const path = '../../test.csv';
const homedir = require('os').homedir();
const reviewsDir = `${homedir}/Desktop/reviews.csv`;
console.log(reviewsDir);


server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/', (req, res) => {
  parse.csvParser(reviewsDir, res);
});