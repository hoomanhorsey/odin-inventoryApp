// routes/indexRouter.js
const { Router } = require("express");

const { updateController } = require("../controllers/updateController");

const router = Router();
router.get("/:bookId", updateController);

// authorRouter.get("/", (req, res) => res.send("All authors"));
// authorRouter.get("/:authorId", (req, res) => {
//   const { authorId } = req.params;
//   res.send(`Author ID: ${authorId}`);
// });

module.exports = router;
