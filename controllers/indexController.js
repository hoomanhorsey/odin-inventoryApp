// controllers/indexController.js

// const db = require("../db");
const { getIndex, newItem } = require("../db/queries");

const { mapperIndex } = require("../services/mapperIndex");

async function indexHomePage(req, res) {
  const records = await getIndex();
  mapperIndex(records);
  res.render("index", { records });
}

// async function getAuthorById(req, res) {
//   const { authorId } = req.params;

//   const author = await db.getAuthorById(Number(authorId));

//   if (!author) {
//     res.status(404).send("Author not found");
//     return;
//   }

//   res.send(`Author Name: ${author.name}`);
// }

module.exports = { indexHomePage };
