// controllers/itemxController.js

// const db = require("../db");

const { getItem } = require("../db/queries");

async function itemUpdateGet(req, res) {
  console.log("itemUpdateGet");

  console.log(req.params.bookId);
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

async function itemUpdatePost(req, res) {
  console.log("itemUpdatePost");
}
async function itemDeletePost(req, res) {
  console.log("itemDeletePost");
}

async function itemDisplayGet(req, res) {
  const bookId = Number(req.params.bookId);

  const bookItem = await getItem(bookId);

  console.log(bookItem);

  res.render("item", { bookId, bookItem });
}

module.exports = {
  itemUpdateGet,
  itemUpdatePost,
  itemDeletePost,
  itemDisplayGet,
};
