"use strict";

//======Start declear Variable

const exprees = require("express");
const axios = require("axios");
const jsonData = require("./movie_data/data.json");
const app = exprees();
//task 13
const port = 3000;

const dotenv = require("dotenv");
const res = require("express/lib/response");

dotenv.config();

const pg = require("pg");

// const client = new pg.Client("postgres://obieda:0000@localhost:5432/movie");

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(exprees.json());

//task13


const APIKEY = process.env.APIKEY;

//======End declear Variable

//======Start MovieInfo Constructor Function

function MovieInfo(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

//======End MovieInfo Constructor Function

//=======Start Task12

//======Start Get the trending movies data from the Movie DB API

app.get("/trending", (req, res) => {
    let movies = [];
    axios
        .get(
            `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`
        )
        .then((value) => {
            value.data.results.forEach((element) => {
                let newMovie = new MovieInfo(
                    element.id,
                    element.title,
                    element.release_date,
                    element.poster_path,
                    element.overview
                );
                movies.push(newMovie);
            });
            // console.log(movies);
            res.status(200).json(movies);
        })
        .catch((error) => {
            console.log(error.data);
        });
});

//======End Get the trending movies data from the Movie DB API

//========Start Search for a movie name to get its information

app.get("/search", (req, res) => {
    let serachQuery = req.query.query;
    let pageQuery = req.query.page;

    console.log(req.query);

    axios
        .get(
            `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${serachQuery}&page=${pageQuery}`
        )
        .then((value) => {
            // console.log(value.data);
            res.status(200).json(value.data);
        });
});

//========End Search for a movie name to get its information

//=======Start Get the primary TV show details by id.

app.get("/tv", (req, res) => {
    let numberOfTV = req.query.query;
    //console.log(req);

    axios
        .get(
            `https://api.themoviedb.org/3/tv/${numberOfTV}?api_key=${APIKEY}&language=en-US`
        )
        .then((value) => {
            res.status(200).json(value.data);
        });
});

//=======End Get the primary TV show details by id.

//=======End Task12

//=================Start Task13

//=====Start create a post request to save a specific movie to database.
app.post("/addMovie", (req, res) => {
    let movieInfo = req.body;

    // console.log(req.body.movie_name);
    // console.log(req.body.poster_path);
    // console.log(req.body.overview);
    console.log(req.body);
    console.log(movieInfo);
    const sql = `INSERT INTO list_movies(movie_name, poster_path, overview) VALUES($1, $2, $3) RETURNING * ;`;

    let values = [
        movieInfo.movie_name,
        movieInfo.poster_path,
        movieInfo.overview,
    ];

    client
        .query(sql, values)
        .then((data) => {
            return res.status(201).json(data.rows);
        })
        .catch((error) => {
            console.log(error);
        });

    // res.send(true);
});

//=====End create a post request to save a specific movie to database.

app.get("/getMovies", (req, res) => {
    const sql = `SELECT * FROM list_movies`;
    client
        .query(sql)
        .then((data) => {
            return res.status(200).json(data.rows);
        })
        .catch((error) => {
            console.log(error);
        });

    // res.send(true); // When i run this code the promise clint.query dosen't work because this row will implement and i will get response this mean i can't get to response \\
});

//=================End Task13

//=================Start Task14

app.put("/UPDATE/:id", (req, res) => {
    let movieInfo = req.body;

    const values = [
        movieInfo.movie_name,
        movieInfo.poster_path,
        movieInfo.overview,
    ];

    const sql = `UPDATE public.list_movies
	SET  movie_name=$1, poster_path=$2, overview=$3
	WHERE movie_id=${req.params.id} RETURNING *`;

    client
        .query(sql, values)
        .then((data) => {
            // console.log(data);
            return res.status(201).send(data.rows);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.delete("/DELETE/:id", (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM public.list_movies
   WHERE movie_id=${id} RETURNING *`;

    client
        .query(sql)
        .then((data) => {
            return res.status(200).json(data.rows);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/getMovieById/:id", (req, res) => {

    const id = req.params.id;

    const sql = `SELECT * FROM list_movies WHERE movie_id=${id}`;
    client
        .query(sql)
        .then((data) => {
            return res.status(200).json(data.rows);
        })
        .catch((error) => {
            console.log(error);
        });
});

//========Start Format Request  Data

// {
//     "movie_name": "Test",
//     "poster_path":"Test",
//     "overview":"Test"
// }

//========End Format Request  Data
//=================End Task14

//===Start Task 11

app.get("/", (req, res) => {
    let movies = [];

    let newMovie = new MovieInfo(
        jsonData.title,
        jsonData.poster_path,
        jsonData.overview
    );
    movies.push(newMovie);
    res.status(200).json(movies);
    //  res.send(movies);
});

app.get("/favorite", (req, res) => {
    let result = "Welcome to Favorite Page";
    // res.status(500);
    // console.log(res.statusCode);
    if (res.statusCode == 500) {
        result = handleError500();
    } else if (res.statusCode == 404) {
        result = handleError404();
    }

    res.send(result);
});

function handleError500() {
    return {
        status: 500,
        responseText: "Sorry, something went wrong",
    };
}

function handleError404() {
    return {
        status: 404,
        responseText: "page not found error",
    };
}

//===End Task 11

client.connect().then((value) => {
    app.listen(port, () => {
        console.log(`server has started on port ${port}`);
    });
});

// {
//     "movie_name": "Spider-Man: No Way Home",
//     "poster_path":"/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
//     "overview":"Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man."
// }

// ======Start This is section for me

// const exprees = require("express");

// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = exprees();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// let notes = [];

// // app.get('/notes', (req, res) => {
// //     res.send("سسسسسسس");
// // });

// app.post("/notes", (req, res) => {
//     const body = req.body;
//     // console.log(res.statusCode);
//     res.statusCode === 200 ? console.log("Body :", body) : console.log("Body :", "false");

//     notes.push(body.title);

//     res.send(true);
// });

// const port = 3000;

// app.listen(port, () => {
//     console.log(`server has started on port ${port}`);
// });

// ======End This is section for me