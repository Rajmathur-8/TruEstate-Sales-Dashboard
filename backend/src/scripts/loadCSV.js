const fs = require("fs");
const csv = require("csv-parser");
const sequelize = require("../config/db");
const Sale = require("../models/sale");
require("dotenv").config();

async function loadCSV() {
  await sequelize.authenticate();
  await Sale.sync();

  const BATCH_SIZE = 5000;
  let buffer = [];

  const stream = fs.createReadStream(process.env.DATA_CSV).pipe(csv());

  stream.on("data", async (row) => {
    stream.pause();

    buffer.push({
      customerId: row["Customer ID"],
      customerName: row["Customer Name"],
      phoneNumber: row["Phone Number"],
      gender: row["Gender"],
      age: parseInt(row["Age"]) || null,
      customerRegion: row["Customer Region"],
      customerType: row["Customer Type"],
      productId: row["Product ID"],
      productName: row["Product Name"],
      brand: row["Brand"],
      productCategory: row["Product Category"],
      tags: row["Tags"],
      quantity: parseInt(row["Quantity"]) || null,
      pricePerUnit: row["Price per Unit"] || null,
      discountPercentage: row["Discount Percentage"] || null,
      totalAmount: row["Total Amount"] || null,
      finalAmount: row["Final Amount"] || null,
      date: row["Date"],
      paymentMethod: row["Payment Method"],
      orderStatus: row["Order Status"],
      deliveryType: row["Delivery Type"],
      storeId: row["Store ID"],
      storeLocation: row["Store Location"],
      salespersonId: row["Salesperson ID"],
      employeeName: row["Employee Name"],
    });

    if (buffer.length >= BATCH_SIZE) {
      try {
        await Sale.bulkCreate(buffer);
        console.log(`Inserted batch of ${buffer.length} rows...`);
        buffer = [];
      } catch (err) {
        console.error("Error inserting batch:", err);
        process.exit(1);
      }
    }

    stream.resume();
  });

  stream.on("end", async () => {
    try {
      if (buffer.length) {
        await Sale.bulkCreate(buffer);
        console.log(`Inserted final batch of ${buffer.length} rows.`);
      }
      console.log("Data imported successfully ✔");
      process.exit();
    } catch (err) {
      console.error("Error finishing import:", err);
      process.exit(1);
    }
  });
}

loadCSV();
