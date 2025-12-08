# Sales Backend API

A Node.js Express server for managing and querying sales data with advanced filtering, pagination, and search capabilities.

## Overview

This backend provides RESTful API endpoints to retrieve and filter sales records from a MySQL database. It's designed to handle large datasets efficiently with batch processing, pagination support, and flexible query parameters.

## Features

- **Advanced Filtering**: Filter by region, gender, product category, payment method, tags, age range, and date range
- **Full-Text Search**: Case-insensitive search across customer names and phone numbers
- **Pagination**: Configurable page sizes (10, 50, 100 records per page)
- **Sorting**: Sort by date, quantity, or customer name in ascending/descending order
- **Bulk Data Import**: Efficient CSV loading with batch processing to handle large datasets
- **CORS Support**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MySQL with Sequelize ORM
- **Development**: Nodemon for hot reloading
- **Data Processing**: csv-parser for CSV imports
- **Configuration**: dotenv for environment variables

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection setup
│   ├── controllers/
│   │   └── saleController.js     # Request handlers
│   ├── models/
│   │   └── sale.js               # Sale data model
│   ├── routes/
│   │   └── sales.js              # API routes
│   ├── services/
│   │   └── saleService.js        # Business logic
│   ├── loaders/
│   │   └── dataLoader.js         # CSV data import utility
│   ├── app.js                    # Express app setup
│   └── index.js                  # Server entry point
├── package.json
├── package-lock.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- CSV data file (optional, for initial data load)

### Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sales_db
DB_USER=root
DB_PASS=your_password
PORT=8080
DATA_CSV=path/to/your/data.csv
```

4. Verify database connection:
```bash
npm start
```

The server should log "Connected to MySQL ✔" if successful.

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8080` (or the PORT specified in `.env`)

## Loading Initial Data

To import sales data from a CSV file:

```bash
npm run load-data
```

**CSV Requirements:**
- Must contain headers matching the column names in the Sale model
- Processed in batches of 5,000 rows for memory efficiency
- Supports the following columns:
  - Customer Info: Customer ID, Customer Name, Phone Number, Gender, Age, Customer Region, Customer Type
  - Product Info: Product ID, Product Name, Brand, Product Category, Tags
  - Transaction: Quantity, Price per Unit, Discount Percentage, Total Amount, Final Amount
  - Order: Date, Payment Method, Order Status, Delivery Type
  - Store/Staff: Store ID, Store Location, Salesperson ID, Employee Name

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Health Check
```
GET /health
```
Returns the server status.

**Response:**
```json
{ "status": "UP" }
```

### Get Sales Records

```
GET /api/sales
```

Returns paginated and filtered sales records.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (0-indexed) | `0` |
| `pageSize` | integer | Records per page (10, 50, 100) | `10` |
| `sortBy` | string | Field to sort by (date, quantity, customerName) | `date` |
| `sortDir` | string | Sort direction (asc, desc) | `desc` |
| `q` | string | Search term (customer name or phone) | `John` |
| `region` | string | Comma-separated regions | `North,South` |
| `gender` | string | Comma-separated genders | `Male,Female` |
| `category` | string | Comma-separated product categories | `Electronics,Clothing` |
| `paymentMethod` | string | Comma-separated payment methods | `Credit Card,Cash` |
| `tags` | string | Comma-separated tags to search | `Premium,Discount` |
| `ageMin` | integer | Minimum age | `25` |
| `ageMax` | integer | Maximum age | `65` |
| `dateFrom` | string | Start date (YYYY-MM-DD) | `2024-01-01` |
| `dateTo` | string | End date (YYYY-MM-DD) | `2024-12-31` |

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "customerId": "CUST001",
      "customerName": "John Doe",
      "phoneNumber": "555-1234",
      "gender": "Male",
      "age": 35,
      "customerRegion": "North",
      "customerType": "Premium",
      "productId": "PROD001",
      "productName": "Laptop",
      "brand": "Dell",
      "productCategory": "Electronics",
      "tags": "Premium,Tech",
      "quantity": 1,
      "pricePerUnit": "999.99",
      "discountPercentage": "10.00",
      "totalAmount": "999.99",
      "finalAmount": "899.99",
      "date": "2024-01-15",
      "paymentMethod": "Credit Card",
      "orderStatus": "Delivered",
      "deliveryType": "Standard",
      "storeId": "STORE001",
      "storeLocation": "New York",
      "salespersonId": "SALES001",
      "employeeName": "Alice Smith"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1000,
  "totalPages": 100,
  "first": true,
  "last": false
}
```

### Query Examples

**Search by customer name with pagination:**
```
GET /api/sales?q=John&page=0&pageSize=10
```

**Filter by region and date range:**
```
GET /api/sales?region=North,South&dateFrom=2024-01-01&dateTo=2024-12-31
```

**Complex filter with sorting:**
```
GET /api/sales?region=North&gender=Male&ageMin=25&ageMax=65&sortBy=quantity&sortDir=desc&pageSize=50
```

**Multi-category search with tags:**
```
GET /api/sales?category=Electronics,Clothing&tags=Premium,Discount&page=0&pageSize=100
```

## Database Schema

### Sales Table

```sql
CREATE TABLE sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customerId VARCHAR(255),
  customerName VARCHAR(255),
  phoneNumber VARCHAR(255),
  gender VARCHAR(50),
  age INT,
  customerRegion VARCHAR(255),
  customerType VARCHAR(255),
  
  productId VARCHAR(255),
  productName VARCHAR(255),
  brand VARCHAR(255),
  productCategory VARCHAR(255),
  tags TEXT,
  
  quantity INT,
  pricePerUnit DECIMAL(10, 2),
  discountPercentage DECIMAL(5, 2),
  totalAmount DECIMAL(10, 2),
  finalAmount DECIMAL(10, 2),
  
  date DATE,
  paymentMethod VARCHAR(255),
  orderStatus VARCHAR(255),
  deliveryType VARCHAR(255),
  storeId VARCHAR(255),
  storeLocation VARCHAR(255),
  salespersonId VARCHAR(255),
  employeeName VARCHAR(255)
);
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

```json
{
  "message": "Error description"
}
```

Common error responses:
- `400 Bad Request`: Invalid query parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Performance Considerations

- **Batch Processing**: CSV import uses 5,000-row batches to manage memory efficiently
- **Pagination**: Always use pagination to limit dataset size
- **Indexes**: Consider adding database indexes on frequently queried columns (region, gender, category, date)
- **Connection Pooling**: Sequelize manages connection pooling automatically

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Load CSV data
npm run load-data
```

### Modifying the API

1. **Add new filter**: Edit `buildWhere()` in `src/services/saleService.js`
2. **Add new sort field**: Update `ALLOWED_SORT_FIELDS` in `saleService.js`
3. **Change page sizes**: Modify `PAGE_SIZES` in `saleService.js`
4. **Add new model fields**: Update both `src/models/sale.js` and CSV loader

## Deployment

1. Set production environment variables in your hosting platform
2. Install dependencies: `npm install --production`
3. Run database migrations: `npm run sync-db` (if implemented)
4. Start server: `npm start`

## Troubleshooting

**Database connection fails:**
- Verify MySQL is running
- Check `.env` credentials
- Ensure database exists

**CSV import errors:**
- Verify CSV file path in `.env`
- Check column headers match model definition
- Ensure proper file permissions

**API returns no results:**
- Check query parameters for typos
- Verify data exists in database
- Check filter combinations aren't too restrictive

## License

ISC

## Support

For issues or questions, review the project structure and API examples above.