// routes/indexRouter.js
const { Router } = require("express");

const {
  itemDisplayGet,
  itemUpdateGet,
  itemUpdatePost,
  itemDeletePost,
} = require("../controllers/itemController");

const router = Router();

// Show update form
router.get("/:bookId/update", itemUpdateGet);
router.post("/:bookId/update", itemUpdatePost);
router.post("/:bookId/delete", itemDeletePost);
router.get("/:bookId", itemDisplayGet);

// authorRouter.get("/", (req, res) => res.send("All authors"));
// authorRouter.get("/:authorId", (req, res) => {
//   const { authorId } = req.params;
//   res.send(`Author ID: ${authorId}`);
// });

module.exports = router;
