// routes/indexRouter.js
const { Router } = require("express");
const {
  categoriesControllerBasic,
} = require("../controllers/categoriesController");

const router = Router();
router.get("/", categoriesControllerBasic);

// authorRouter.get("/", (req, res) => res.send("All authors"));
// authorRouter.get("/:authorId", (req, res) => {
//   const { authorId } = req.params;
//   res.send(`Author ID: ${authorId}`);
// });

module.exports = router;
