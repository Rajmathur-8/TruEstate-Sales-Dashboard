# Sales Dashboard Frontend

A modern React application for visualizing and filtering sales data. Built with React 19, Vite, Tailwind CSS, and Axios for seamless integration with the backend API.

## Overview

This frontend provides an intuitive interface to query, filter, sort, and paginate sales records from the backend API. Users can search by customer details, apply multi-dimensional filters, and view results in a responsive data table.

## Features

- **Real-time Search**: Search by customer name or phone number with case-insensitive matching
- **Advanced Filtering**: Filter by region, gender, product category, payment method, tags, age range, and date range
- **Flexible Sorting**: Sort by date, quantity, or customer name in ascending or descending order
- **Pagination**: Configurable page sizes (10, 50, 100 records per page)
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile devices
- **Loading & Error States**: User-friendly feedback during data fetching
- **Modern Stack**: Built with latest versions of React, Vite, and Tailwind CSS

## Tech Stack

- **React 19.2**: UI library with hooks for state management
- **Vite 7.2**: Lightning-fast build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS framework
- **Axios 1.13**: HTTP client for API requests
- **React Select 5**: Advanced select component for multi-select filters
- **React Icons 5.5**: Icon library
- **ESLint 9**: Code quality and style enforcement

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx        # Customer search input
│   │   ├── Filters.jsx          # Advanced filter panel
│   │   ├── SortBar.jsx          # Sort field and direction selector
│   │   ├── SalesTable.jsx       # Data table display
│   │   └── Pagination.jsx       # Page navigation and size selector
│   ├── App.jsx                  # Main app component with state management
│   ├── api.js                   # Axios instance configuration
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS imports
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
└── README.md
```

## Installation

### Prerequisites

- Node.js v18+ and npm v8+
- Backend API running on `http://localhost:8080/api`

### Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Verify the API endpoint in `src/api.js`:
```javascript
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
```
Update if your backend runs on a different URL.

## Running the Application

### Development Mode (Hot Reload)
```bash
npm run dev
```
Server runs on `http://localhost:5173` with automatic reload on file changes.

### Production Build
```bash
npm run build
```
Generates optimized static files in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

### Code Quality Check
```bash
npm run lint
```
Runs ESLint to check for code style issues.

## Component Documentation

### SearchBar
Provides full-text search across customer names and phone numbers.

**Props:**
- `value` (string): Current search query
- `onChange` (function): Callback when search input changes

**Usage:**
```jsx
<SearchBar value={query} onChange={setQuery} />
```

### Filters
Advanced filter panel for multi-dimensional data filtering.

**Props:**
- `filters` (object): Current filter state
- `setFilters` (function): Update filter state
- `resetPage` (function): Reset pagination to page 0

**Filter Fields:**
- Region, Gender, Category, Tags, Payment Method (multi-select)
- Age Min/Max (numeric range)
- Date From/To (date range)

**Usage:**
```jsx
<Filters filters={filters} setFilters={setFilters} resetPage={() => setPage(0)} />
```

### SortBar
Selector for sort field and direction.

**Props:**
- `sortBy` (string): Current sort field
- `sortDir` (string): 'asc' or 'desc'
- `setSortBy` (function): Update sort field
- `setSortDir` (function): Update sort direction

**Available Sort Fields:**
- date (default)
- quantity
- customerName

**Usage:**
```jsx
<SortBar sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
```

### SalesTable
Displays sales records in a responsive table format.

**Props:**
- `sales` (array): Array of sales objects to display

**Features:**
- Serial numbering
- Alternating row colors for readability
- Status badges (Completed, Pending, Cancelled)
- Hover effects
- Horizontal scrolling on mobile

**Usage:**
```jsx
<SalesTable sales={sales} />
```

### Pagination
Navigation and page size controls.

**Props:**
- `page` (number): Current page (0-indexed)
- `totalPages` (number): Total number of pages
- `setPage` (function): Navigate to page
- `pageSize` (number): Records per page
- `setPageSize` (function): Change page size

**Available Page Sizes:**
- 10 records per page
- 50 records per page
- 100 records per page

**Usage:**
```jsx
<Pagination
  page={page}
  totalPages={totalPages}
  setPage={setPage}
  pageSize={pageSize}
  setPageSize={setPageSize}
/>
```

## App State Management

The main `App.jsx` component manages all application state using React hooks:

```javascript
// Search and filters
const [query, setQuery] = useState("");
const [filters, setFilters] = useState({ /* ... */ });

// Sorting
const [sortBy, setSortBy] = useState("date");
const [sortDir, setSortDir] = useState("desc");

// Pagination
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(10);

// Data and UI state
const [sales, setSales] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [totalPages, setTotalPages] = useState(1);
```

## API Integration

The frontend communicates with the backend via the `/api/sales` endpoint.

### Request Parameters

```javascript
const params = {
  q: "search_term",                    // Full-text search
  region: "North,South",               // Multi-select
  gender: "Male,Female",               // Multi-select
  category: "Electronics,Clothing",    // Multi-select
  tags: "Premium,Discount",            // Multi-select
  paymentMethod: "Card,Cash",          // Multi-select
  ageMin: 25,                          // Range min
  ageMax: 65,                          // Range max
  dateFrom: "2024-01-01",              // Date range start
  dateTo: "2024-12-31",                // Date range end
  sortBy: "date",                      // date | quantity | customerName
  sortDir: "desc",                     // asc | desc
  page: 0,                             // 0-indexed page number
  pageSize: 10                         // 10 | 50 | 100
};
```

### Response Format

```javascript
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

## Styling

The application uses Tailwind CSS with a modern design system:

- **Color Scheme**: Blue primary, slate neutrals
- **Spacing**: Consistent padding/margins using Tailwind scale
- **Shadows**: Subtle shadows for depth
- **Rounded Corners**: 2xl border-radius for modern appearance
- **Responsive**: Mobile-first design with md and lg breakpoints

### Key Classes

```tailwind
.bg-gradient-to-br from-slate-50 to-slate-100  /* Page background */
.bg-white/90 backdrop-blur-xl                   /* Glass effect */
.rounded-2xl shadow-lg border border-slate-200  /* Card style */
.focus:ring-2 focus:ring-blue-500              /* Focus states */
.transition-all                                 /* Smooth animations */
```

## Performance Optimizations

- **useCallback**: Prevents unnecessary function recreations and re-renders
- **startTransition**: Manages state updates smoothly without blocking UI
- **Lazy Loading**: Data loads on-demand via pagination
- **Efficient Re-renders**: Component state isolated to minimize updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Failed
- Verify backend is running on `http://localhost:8080`
- Check CORS settings in backend
- Verify API endpoint in `src/api.js`

### No Data Displays
- Check browser console for API errors
- Verify query parameters are valid
- Ensure backend database has sales records

### Styling Issues
- Clear browser cache
- Rebuild with `npm run build`
- Check Tailwind CSS is properly configured

### Hot Reload Not Working
- Restart dev server: `npm run dev`
- Ensure Vite config is correct
- Check file watcher limits (Linux users)

## Development Tips

### Adding New Filters
1. Add field to `filters` state in `App.jsx`
2. Add input to `Filters.jsx` component
3. Include in API request parameters

### Customizing Table Columns
Edit the column list in `SalesTable.jsx`:
```javascript
{[
  "Customer", "Phone", "Age", "Region", // ... add/remove columns
].map((title) => (
  // Column header
))}
```

### Changing API Endpoint
Update `src/api.js`:
```javascript
export const api = axios.create({
  baseURL: "http://your-api.com/api",
});
```

## Deployment

### Static Hosting (Vercel, Netlify, GitHub Pages)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting provider

3. Configure environment variables if API URL differs:
```bash
VITE_API_URL=https://api.example.com
```

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation in backend README
3. Check browser console for error messages
4. Verify all environment variables are set correctly