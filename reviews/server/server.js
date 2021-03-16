const express = require('express');
const server = express();
const port = 3080;

server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});

server.get('/', (req, res) => {
  res.send('Hello, Postman!').end();
});