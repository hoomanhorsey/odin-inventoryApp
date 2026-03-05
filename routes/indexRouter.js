// routes/indexRouter.js
const { Router } = require("express");

const { indexHomePage, itemNew } = require("../controllers/indexController");

const router = Router();
router.get("/new", itemNew);

router.get("/", indexHomePage);

module.exports = router;
