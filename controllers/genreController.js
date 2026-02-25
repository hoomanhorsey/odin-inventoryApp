// controllers/itemxController.js

// const db = require("../db");

const { getBooksByGenre } = require("../db/queries");

async function genreController(req, res) {
  const genre = req.params.genre;

  const booksByGenre = await getBooksByGenre(genre);

  console.log("Genre controller in the house");
  console.log(booksByGenre);

  res.render("genres", { booksByGenre });
}

module.exports = { genreController };
