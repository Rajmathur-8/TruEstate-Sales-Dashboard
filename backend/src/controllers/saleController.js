const { findSales } = require("../services/saleService");

async function getSales(req, res, next) {
  try {
    const data = await findSales(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getSales };