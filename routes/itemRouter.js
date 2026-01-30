// routes/indexRouter.js
const { Router } = require("express");

const { itemControllerBasic } = require("../controllers/itemController");

const router = Router();
router.get("/", itemControllerBasic);

// authorRouter.get("/", (req, res) => res.send("All authors"));
// authorRouter.get("/:authorId", (req, res) => {
//   const { authorId } = req.params;
//   res.send(`Author ID: ${authorId}`);
// });

module.exports = router;
