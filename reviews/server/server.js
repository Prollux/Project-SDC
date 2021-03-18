const express = require('express');
const server = express();
const port = 3080;
const parse = require('../parser/csvParser.js');
const path = '../../test.csv';
const homedir = require('os').homedir();
const reviewsDir = `${homedir}/Desktop/reviews.csv`;
const db = require('../database/database.js');

server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/', (req, res) => {
  parse.csvParser(reviewsDir, db.Reviews, res);
});

server.patch('/', (req, res) => {
  db.deleteAll(res);
});