const router = require("express").Router();
const { getSales } = require("../controllers/saleController");

router.get("/", getSales);

module.exports = router;
