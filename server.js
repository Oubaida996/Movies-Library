"use strict";

const exprees = require("express");
const jsonData = require("./movie_data/data.json");
const port = 3000;
const app = exprees();


// console.log(jsonData);



function MovieInfo(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get("/", (req, res) => {
    let movies = [];

    let newMovie = new MovieInfo(jsonData.title, jsonData.poster_path, jsonData.overview);
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