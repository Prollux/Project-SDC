const express = require('express');
const server = express();
const port = 3080;
const parse = require('../parser/csvParser.js');
const path = '../../test.csv';
const homedir = require('os').homedir();
const reviewsDir = `${homedir}/Desktop/reviews.csv`;
const photosDir = `${homedir}/Desktop/reviews_photos.csv`;
const db = require('../database/database.js');

server.use(express.json());
server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/reviews', (req, res) => {
  data = req.query;
  if (!data) {
    data = {reviews: '24'};
  };
  db.getReviews(data, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(result);
    }
  });
});

server.get('/photos', (req, res) => {
  let id = Number(req.query.review_id)
  db.getPhotosbyId(id, (result) => {
    res.send(result);
  });
});

server.patch('/reviews', (req, res) => {
  db.deleteAll(res);
});