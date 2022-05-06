const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express"),
  //Morgan instead of fs module, to best handle multiple files
  morgan = require("morgan"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

//express.static rather than using http, url and fs modules, for best handle the exposing of static files.
app.use(express.static("public"));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
  {
    id: 1,
    name: "Lulu",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Ugo",
    favoriteMovies: ["Lord of the Rings", "Ciao Alberto"],
  },
];

let movies = [
  {
    id: 1,
    Title: "Harry Potter and the Sorcerer's Stone",
    Description: "Some description",
    Genre: { Name: "Drama" },
    Director: {
      Name: "Some Name",
      Bio: "Director bio",
      Birth: "date of birth",
    },
    Image: "https://...",
  },
  {
    id: 2,
    Title: "Lord of the Rings",
    Description: "Some description",
    Genre: { Name: "Fiction" },
    Director: {
      Name: "Another Name",
      Bio: "Director bio",
      Birth: "date of birth",
    },
    Image: "https://...",
  },
  {
    id: 3,
    Title: "Twilight",
    Description: "Some description",
    Genre: { Name: "Fiction, Romance" },
    Director: {
      Name: "Name",
      Bio: "Director bio",
      Birth: "date of birth",
    },
    Image: "https://...",
  },
];

//Allow existing users to deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User (id: ${id}) register has been deleted`);
  } else {
    res.status(400).send("no such user");
  }
});

//Allow users to remove a movie from their list of favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(
        `${movieTitle} has been removed from user's (id: ${id}) favorite list`
      );
  } else {
    res.status(400).send("no such movie");
  }
});

//Allow users to add a movie to their list of favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been added to ${id} user's favorite list`);
  } else {
    res.status(400).send("no such user");
  }
});

//Allow new users to register
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("name is required");
  }
});

//Allow users to update their user info
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUserName = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUserName.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

//Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//Return data about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

//Return data about a genre by name/title
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

//Return data about a director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
