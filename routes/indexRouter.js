// routes/indexRouter.js
const { Router } = require("express");

const { indexHomePage } = require("../controllers/indexController");

const router = Router();
router.get("/", indexHomePage);

// authorRouter.get("/", (req, res) => res.send("All authors"));
// authorRouter.get("/:authorId", (req, res) => {
//   const { authorId } = req.params;
//   res.send(`Author ID: ${authorId}`);
// });

module.exports = router;
