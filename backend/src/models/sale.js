const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Sale = sequelize.define('Sale', {
    id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerId: DataTypes.STRING,
    customerName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    customerRegion: DataTypes.STRING,
    customerType: DataTypes.STRING,

    productId: DataTypes.STRING,
    productName: DataTypes.STRING,
    brand: DataTypes.STRING,
    productCategory: DataTypes.STRING,
    tags: DataTypes.TEXT,

    quantity: DataTypes.INTEGER,
    pricePerUnit: DataTypes.DECIMAL(10, 2),
    discountPercentage: DataTypes.DECIMAL(5, 2),
    totalAmount: DataTypes.DECIMAL(10, 2),
    finalAmount: DataTypes.DECIMAL(10, 2),

    date: DataTypes.DATEONLY,
    paymentMethod: DataTypes.STRING,
    orderStatus: DataTypes.STRING,
    deliveryType: DataTypes.STRING,
    storeId: DataTypes.STRING,
    storeLocation: DataTypes.STRING,
    salespersonId: DataTypes.STRING,
    employeeName: DataTypes.STRING
},{ tableName: 'sales', timestamps: false }
)

module.exports = Sale;