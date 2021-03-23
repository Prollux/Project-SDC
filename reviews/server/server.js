const express = require('express');
const server = express();
const port = 3080;
const db = require('../database/database.js');
const parse = require('../parser/csvParser.js');
const path = '../../test.csv';
const sortBy = require('../methods/sortMethods.js');
const shape = require('../methods/averageChars.js');
const homedir = require('os').homedir();
const reviewsDir = `${homedir}/Desktop/CSVs/reviews.csv`;
const metaDir = `${homedir}/Desktop/CSVs/meta.csv`;


server.use(express.json());
server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/reviews', (req, res) => {
  count = req.query.count || 5;
  if (count > 100) {
    count = 100;
  }
  page = Number(req.query.page) || 0;
  data = {product_id: +req.query.product_id};
  if (!data.product_id) {
    data = {product_id: 24};
  };
  console.log(data);
  db.getReviews(data, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      switch(req.query.sort) {
        case "helpful":
          result = sortBy.helpfulness(result);
          break;

        case "newest":
          result = sortBy.newest(result);
          break;

        default:
          result = sortBy.relevant(result);
      }
      res.send({
        product: data.product_id,
        page: page,
        count: Number(count),
        results: result.slice(count * page, (count * page) + count)
        })
    }
  });
});



server.get('/reviews/meta', (req, res) => {
  //do something
  id = req.query.product_id;
  if (!id) {
    id ='24';
  }
  db.getMeta(id, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      result = {product_id: id,
                ratings: shape.averageChars(result)
               };
      res.status(201).send(result);
    }
  });
});

server.patch('/meta', (req, res) => {
  parse.metaParser(metaDir, db.MetaData, res);
})

server.patch('/reviews', (req, res) => {
  parse.ReviewParser(reviewsDir, db.Reviews, res);
})