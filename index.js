const express = require("express"),
  //Morgan instead of fs module, to best handle multiple files
  morgan = require("morgan");

const app = express();

let movies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    director: "",
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
    director: "",
  },
  {
    title: "Twilight",
    author: "Stephanie Meyer",
    director: "",
  },
];

//express.static rather than using http, url and fs modules, for best handle the exposing of static files.
app.use(express.static("public"));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

// app.get("/images/headerImage.jpg", (req, res) => {
//   res.sendFile("public/images/headerImage.jpg", { root: __dirname });
// });

// app.get("/javascript/main.js", (req, res) => {
//   res.sendFile("public/javascript/main.js", { root: __dirname });
// });

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
