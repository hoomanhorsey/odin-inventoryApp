// controllers/itemxController.js

// const db = require("../db");

const { getItem } = require("../db/queries");

async function updateController(req, res) {
  const bookId = Number(req.params.bookId);
  const bookItem = await getItem(bookId);

  console.log(bookItem);
  //   const bookId = Number(req.params.bookId);
  //   const bookItem = await getItem(bookId);
  //   console.log(bookItem);
  //   res.render("item", { bookId, bookItem });

  console.log("update controller called");
  res.render("updateItem", { bookId, bookItem });
}

module.exports = { updateController };
