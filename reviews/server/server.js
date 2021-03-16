const express = require('express');
const server = express();
const port = 3080;
const parse = require('../parser/csvparser.js');
const path = '../../test.csv';


server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/', (req, res) => {
  parse.csvParser(path, (err, result) => {
    debugger;
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
});