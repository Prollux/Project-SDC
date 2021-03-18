const express = require('express');
const server = express();
const port = 3080;
const parse = require('../parser/csvParser.js');
const path = '../../test.csv';
const homedir = require('os').homedir();
const reviewsDir = `${homedir}/Desktop/reviews.csv`;
const photosDir = `${homedir}/Desktop/reviews_photos.csv`;
const db = require('../database/database.js');

server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/reviews', (req, res) => {
  parse.csvParser(reviewsDir, db.Reviews, res);
});

server.get('/photos', (req, res) => {
  parse.photoParser(photosDir, db.Photos, res);
});

server.patch('/reviews', (req, res) => {
  db.deleteAll(res);
});