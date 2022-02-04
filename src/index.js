const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require ('./data/users.json');

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
  //PRIMERA OPCION-------------------
  // const response = {
  //   success: true,
  //   movies: movies,
  // };
  // const filterGender = response.movies.filter(
  //   (movie) => movie.gender === req.query.gender
  // );
  // res.json(filterGender);
  //------------------------------------------------------------
  //SEGUNDO OPCION: funciona pero no filtra todas---------------
  // console.log(req.query);
  // const genderFilterParam= movies.filter((movie)=> movie.gender === req.query.gender)
  // res.send({
  //   success: true,
  //   movies:genderFilterParam
  // });

 const genderFilterParam =req.query.gender;
 const filterdMovies= movies.filter((movie)=>{
   if  (genderFilterParam === ''){
     return movie;
   }else {
     return movie.gender === genderFilterParam;
   }
 });
 
 res.json({
   sucess: true,
   movies: filterdMovies
 });
});

//Aqui ponemos los ficheros estáticos
const staticServerPath= "./src/public";
server.use(express.static(staticServerPath));

const staticServerMoviesImage= "./src/public-movies-images";
server.use(express.static(staticServerMoviesImage));


server.post("/login", (req,res)=>{
  console.log(req.body);
  const emailLogin = req.body.email;
  const passwordLogin = req.body.password;
  const foundUser = users.find(
    (user) =>
      user.password === passwordLogin && user.email === emailLogin
  );
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


