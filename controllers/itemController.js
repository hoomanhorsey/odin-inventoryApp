// controllers/itemxController.js

// const db = require("../db");

const { getItem, updateItem, deleteItem, newItem } = require("../db/queries");

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
  const bookId = Number(req.params.bookId);
  console.table(req.body);
  console.log("This just a console log - itemUpdatePost " + bookId);

  await updateItem(bookId, req.body);

  const bookItem = await getItem(bookId);
  res.render("item", { bookId, bookItem });

  /// Just have to write sql query to udpate.
  // res.redirect(`/item/${bookId}`);
}

async function itemDeletePost(req, res) {
  const { bookId } = req.params;

  await deleteItem(bookId); // your DB function

  console.log("itemDeletePost");
  res.redirect("/");
}

async function itemDisplayGet(req, res) {
  const bookId = Number(req.params.bookId);

  const bookItem = await getItem(bookId);

  console.log(bookItem);

  res.render("item", { bookId, bookItem });
}

function itemDisplayNewForm(req, res) {
  console.log("presenting new item form");
  res.render("newItem");
}

async function itemInsertNew(req, res) {
  console.log("calling new item");
  console.log(
    req.body.bookTitle,
    req.body.authors,
    req.body.pages,
    req.body.year_published,
    req.body.publisher_name,
    req.body.publisher_country,
    req.body.genres,
  );
  await newItem(req.body);

  res.redirect("/");
}

module.exports = {
  itemUpdateGet,
  itemUpdatePost,
  itemDeletePost,
  itemDisplayGet,
  itemDisplayNewForm,
  itemInsertNew,
};
