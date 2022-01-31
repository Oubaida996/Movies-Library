"use strict";

//======Start declear Variable

const exprees = require("express");
const axios = require("axios");
const jsonData = require("./movie_data/data.json");
const port = 3000;
const app = exprees();

const dotenv = require("dotenv");

dotenv.config();

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
        .get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
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
    //console.log(serachQuery);

    axios
        .get(
            `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${serachQuery}`
        )
        .then((value) => {
            res.status(200).json(movies);
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

app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});

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