const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, res) => {
  const response = {
    success: true,
    movies: movies,
  };
  const filterGender = response.movies.filter(
    (movie) => movie.gender === req.query.gender
  );
  res.json(filterGender);
});
