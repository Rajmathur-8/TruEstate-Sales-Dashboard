const { Op, fn, col, where } = require("sequelize");
const Sale = require("../models/sale");

// Allowed page sizes
const PAGE_SIZES = { 10: 10, 50: 50, 100: 100 };
const DEFAULT_PAGE_SIZE = 10;

// Allowed sort fields
const ALLOWED_SORT_FIELDS = ["date", "quantity", "customerName"];

// Utility functions
const parseIntSafe = (v) => (isNaN(v) || v === undefined ? null : parseInt(v));
const splitCsv = (v) => (v ? v.split(",").map((s) => s.trim()) : []);
const parseDate = (v) => (v ? v : null);

function buildWhere(params) {
  const conditions = [];

  // 🔍 Search (case insensitive)
  if (params.q) {
    const q = `%${params.q.toLowerCase()}%`;
    conditions.push({
      [Op.or]: [
        where(fn("LOWER", col("customerName")), { [Op.like]: q }),
        where(fn("LOWER", col("phoneNumber")), { [Op.like]: q }),
      ],
    });
  }

  // Multi-select filters
  const region = splitCsv(params.region);
  if (region.length) conditions.push({ customerRegion: { [Op.in]: region } });

  const gender = splitCsv(params.gender);
  if (gender.length) conditions.push({ gender: { [Op.in]: gender } });

  const category = splitCsv(params.category);
  if (category.length) conditions.push({ productCategory: { [Op.in]: category } });

  const payment = splitCsv(params.paymentMethod);
  if (payment.length) conditions.push({ paymentMethod: { [Op.in]: payment } });

  // Tags filter
  const tags = splitCsv(params.tags);
  if (tags.length) {
    conditions.push({
      [Op.or]: tags.map((t) =>
        where(fn("LOWER", col("tags")), { [Op.like]: `%${t.toLowerCase()}%` })
      ),
    });
  }

  // Age range
  const ageMin = parseIntSafe(params.ageMin);
  const ageMax = parseIntSafe(params.ageMax);

  if (ageMin !== null && ageMax !== null)
    conditions.push({ age: { [Op.between]: [ageMin, ageMax] } });
  else if (ageMin !== null) conditions.push({ age: { [Op.gte]: ageMin } });
  else if (ageMax !== null) conditions.push({ age: { [Op.lte]: ageMax } });

  // Date range
  const dateFrom = parseDate(params.dateFrom);
  const dateTo = parseDate(params.dateTo);

  if (dateFrom && dateTo)
    conditions.push({ date: { [Op.between]: [dateFrom, dateTo] } });
  else if (dateFrom) conditions.push({ date: { [Op.gte]: dateFrom } });
  else if (dateTo) conditions.push({ date: { [Op.lte]: dateTo } });

  return conditions.length ? { [Op.and]: conditions } : {};
}

async function findSales(params) {
  const page = parseIntSafe(params.page) ?? 0;

  // Page size support (10 / 50 / 100)
  let pageSize = parseIntSafe(params.pageSize);
  if (!pageSize || !PAGE_SIZES[pageSize]) {
    pageSize = DEFAULT_PAGE_SIZE;
  }

  // Sorting
  const sortBy = ALLOWED_SORT_FIELDS.includes(params.sortBy)
    ? params.sortBy
    : "date";

  const sortDir = params.sortDir === "asc" ? "ASC" : "DESC";

  const where = buildWhere(params);

  const result = await Sale.findAndCountAll({
    where,
    order: [[sortBy, sortDir]],
    limit: pageSize,
    offset: page * pageSize,
  });

  return {
    content: result.rows,
    page,
    size: pageSize,
    totalElements: result.count,
    totalPages: Math.ceil(result.count / pageSize),
    first: page === 0,
    last: page >= Math.ceil(result.count / pageSize) - 1,
  };
}

module.exports = { findSales };
