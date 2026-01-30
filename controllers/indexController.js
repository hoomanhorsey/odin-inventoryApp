// controllers/indexController.js

// const db = require("../db");
const { getIndex } = require("../db/queries");

async function indexHomePage(req, res) {
  const books = await getIndex();
  res.render("index", { books });
}

async function getAuthorById(req, res) {
  const { authorId } = req.params;

  const author = await db.getAuthorById(Number(authorId));

  if (!author) {
    res.status(404).send("Author not found");
    return;
  }

  res.send(`Author Name: ${author.name}`);
}

module.exports = { indexHomePage, getAuthorById };
