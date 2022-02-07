const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const db = Database('./src/db/database.db', { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, res) => {
  const query = db.prepare(
    `SELECT * FROM movies ORDER BY name ${req.query.sort}`
  );
  const movies = query.all();

  const genderFilterParam = req.query.gender;

  const filterdMovies = movies.filter((movie) => {
    if (genderFilterParam === '') {
      return movie;
    } else {
      return movie.gender === genderFilterParam;
    }
  });

  res.json({
    sucess: true,
    movies: filterdMovies,
  });
});

server.get('/movie/:movieId', (req, res) => {
  const query = db.prepare('SELECT * FROM movies WHERE id = ?');
  const foundMovie = query.get(req.params.movieId);
  // Sin BBDD
  // const foundMovie = movies.find((movie) => movie.id === req.params.movieId);
  res.render('movie', foundMovie);
});

//Aqui ponemos los ficheros estáticos
const staticServerPath = './src/public';
server.use(express.static(staticServerPath));

const staticServerMoviesImage = './src/public-movies-images';
server.use(express.static(staticServerMoviesImage));

const staticServerMoviesStyle = './src/public/static/css';
server.use(express.static(staticServerMoviesStyle));

// Creamos nuestros endpoint
server.post('/login', (req, res) => {
  const query = db.prepare(
    'SELECT * FROM users WHERE email = ? AND password = ?'
  );
  const foundUser = query.get(req.body.email, req.body.password);
  // Antes de BBDD
  // const emailLogin = req.body.email;
  // const passwordLogin = req.body.password;
  // const foundUser = users.find(
  //   (user) => user.password === passwordLogin && user.email === emailLogin
  // );
  if (foundUser) {
    res.json({
      success: true,
      userId: foundUser.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuario no encontrado',
    });
  }
});
