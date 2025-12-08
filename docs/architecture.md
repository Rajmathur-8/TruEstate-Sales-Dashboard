# TruEstate Sales Dashboard - Architecture Document

## 1. System Overview

TruEstate Sales Dashboard is a full-stack real estate analytics platform built with a clear separation between client and server. The application handles 5,000+ property transactions with advanced filtering, search, sorting, and pagination capabilities.

**Tech Stack:**
- **Backend:** Node.js + Express.js + Sequelize ORM + MySQL
- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Communication:** RESTful API with Axios

---

## 2. Backend Architecture

### 2.1 Layered Architecture Pattern

The backend follows a **three-tier architecture** for clear separation of concerns:

```
┌─────────────────────────────────────┐
│   Presentation Layer (Routes)       │  ← HTTP Request Entry
├─────────────────────────────────────┤
│   Business Logic Layer (Services)   │  ← Query Building & Filtering
├─────────────────────────────────────┤
│   Data Access Layer (Models/ORM)    │  ← Database Operations
└─────────────────────────────────────┘
```

### 2.2 Module Responsibilities

#### **Routes Layer** (`src/routes/sales.js`)
- Defines API endpoints
- Maps HTTP requests to controller functions
- Single route: `GET /api/sales`

#### **Controller Layer** (`src/controllers/saleController.js`)
- Handles HTTP request/response
- Extracts query parameters
- Delegates business logic to services
- Returns JSON responses with proper status codes

#### **Service Layer** (`src/services/saleService.js`)
**Core Responsibilities:**
- **Query Building:** Constructs complex Sequelize queries
- **Filtering Logic:** Processes 9 filter types (region, gender, category, tags, payment, age range, date range)
- **Search Logic:** Case-insensitive multi-field search (name, phone)
- **Pagination:** Offset-based pagination with configurable page sizes
- **Sorting:** SQL-injection-safe column sorting with whitelisting
- **Data Transformation:** Formats results into paginated response structure

**Key Functions:**
```javascript
buildWhere(params)      // Builds SQL WHERE clause from filters
findSales(params)       // Main orchestration function
```

#### **Model Layer** (`src/models/sale.js`)
- Defines `Sales` table schema (32 columns)
- Sequelize model with data type definitions
- No business logic—pure data definition

#### **Configuration** (`src/config/db.js`)
- Sequelize connection configuration
- Database credentials management
- Connection pooling settings

#### **Data Loader** (`src/loaders/dataLoader.js`)
- CSV import utility
- Streams CSV files for memory efficiency
- Batch inserts (5,000 rows per batch)
- Maps CSV columns to database fields

---

## 3. Frontend Architecture

### 3.1 Component-Based Architecture

The frontend uses **React functional components** with hooks for state management:

```
┌─────────────────────────────────────┐
│           App.jsx (Root)             │  ← State Management Hub
│  ┌───────────────────────────────┐  │
│  │  useEffect → fetchSales()     │  │  ← API Orchestration
│  │  useState → state management  │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│      Presentational Components      │
│  • SearchBar     • Filters          │
│  • SortBar       • SalesTable       │
│  • Pagination                       │
└─────────────────────────────────────┘
```

### 3.2 State Management Strategy

**App.jsx** manages all application state using React hooks:

```javascript
// User Input State
- query (search term)
- filters (9 filter dimensions)
- sortBy, sortDir (sorting preferences)
- page, pageSize (pagination state)

// API Response State
- sales (current page data)
- totalPages (pagination metadata)

// UI State
- loading (loading indicator)
- error (error messages)
```

**Data Flow Pattern:**
1. User interaction → State update
2. State change triggers `useEffect`
3. `useEffect` calls `fetchSales()`
4. API request sent via Axios
5. Response updates `sales` and `totalPages`
6. React re-renders UI components

### 3.3 Component Responsibilities

#### **App.jsx (Container Component)**
- Central state management
- API communication via `fetchSales()`
- Passes state and callbacks to child components
- Implements `startTransition` for non-blocking updates

#### **SearchBar.jsx**
- Controlled input component
- Accepts `value` and `onChange` props
- Debounced search (handled by parent)

#### **Filters.jsx**
- Multi-dimensional filter panel
- 9 filter types:
  - Multi-select: region, gender, category, tags, payment
  - Range filters: ageMin/Max, dateFrom/To
- Parses comma-separated values
- Resets pagination on filter change

#### **SortBar.jsx**
- Dropdown selectors for:
  - Sort field (date, quantity, customerName)
  - Sort direction (asc, desc)
- Immediate sort application

#### **SalesTable.jsx**
- Renders sales data in responsive table
- 17 columns including serial number
- Status badge styling (Completed/Pending/Cancelled)
- Handles empty state

#### **Pagination.jsx**
- Page navigation controls
- Page size selector (10/50/100)
- Boundary detection (disable prev/next)
- Page indicator display

---

## 4. Data Flow

### 4.1 Request Flow (Frontend → Backend)

```
User Action
    ↓
State Update (App.jsx)
    ↓
useEffect Trigger
    ↓
fetchSales() executes
    ↓
Axios GET /api/sales?params
    ↓
Express Router (routes/sales.js)
    ↓
Controller (getSales)
    ↓
Service (findSales)
    ↓
Sequelize Model
    ↓
MySQL Database
```

### 4.2 Response Flow (Backend → Frontend)

```
MySQL Query Result
    ↓
Sequelize transforms to JS objects
    ↓
Service formats pagination metadata
    ↓
Controller sends JSON response
    ↓
Axios receives response
    ↓
startTransition → setSales()
    ↓
React re-renders components
    ↓
Updated UI displayed
```

### 4.3 API Request Example

```javascript
// Frontend Request
GET /api/sales?
  q=john
  &region=North,South
  &gender=Male
  &ageMin=25
  &ageMax=65
  &dateFrom=2024-01-01
  &dateTo=2024-12-31
  &sortBy=date
  &sortDir=desc
  &page=0
  &pageSize=10
```

```javascript
// Backend Response
{
  "content": [...],      // Array of 10 sales records
  "page": 0,
  "size": 10,
  "totalElements": 5000,
  "totalPages": 500,
  "first": true,
  "last": false
}
```

---

## 5. Folder Structure

### 5.1 Backend Structure

```
backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── index.js                  # Server entry point
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   └── sale.js               # Sale model (32 columns)
│   ├── controllers/
│   │   └── saleController.js     # HTTP request handlers
│   ├── services/
│   │   └── saleService.js        # Business logic & query building
│   ├── routes/
│   │   └── sales.js              # API route definitions
│   └── loaders/
│       └── dataLoader.js         # CSV import utility
├── .env                          # Environment variables
└── package.json
```

**Module Interactions:**
- `index.js` → initializes DB and starts server
- `app.js` → configures middleware and routes
- `routes/sales.js` → maps `/api/sales` to controller
- `controller` → delegates to service layer
- `service` → uses model for DB queries

### 5.2 Frontend Structure

```
frontend/
├── src/
│   ├── App.jsx                   # Root component + state management
│   ├── api.js                    # Axios instance configuration
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Tailwind imports
│   └── components/
│       ├── SearchBar.jsx         # Search input component
│       ├── Filters.jsx           # Filter panel component
│       ├── SortBar.jsx           # Sort controls component
│       ├── SalesTable.jsx        # Data table component
│       └── Pagination.jsx        # Pagination controls component
├── vite.config.js                # Vite configuration
├── index.html                    # HTML entry point
└── package.json
```

**Component Hierarchy:**
```
App.jsx
  ├── SearchBar
  ├── Filters
  ├── SortBar
  ├── SalesTable
  └── Pagination
```

---

## 6. Key Design Decisions

### 6.1 Backend Design Patterns

**1. Separation of Concerns**
- Routes handle HTTP only
- Services contain business logic
- Models define data structure

**2. SQL Injection Prevention**
- Whitelist validation for sort fields
- Parameterized queries via Sequelize
- Input sanitization in service layer

**3. Memory Efficiency**
- Streaming CSV parser
- Batch inserts (5,000 rows)
- Offset-based pagination (no full table scan)

**4. Database Optimization**
- Connection pooling
- Indexed columns (implied by usage patterns)
- Sequelize query optimization

### 6.2 Frontend Design Patterns

**1. Single Source of Truth**
- All state managed in `App.jsx`
- Props flow down, callbacks flow up

**2. Controlled Components**
- All inputs controlled via React state
- Predictable data flow

**3. Performance Optimization**
- `useCallback` for `fetchSales()`
- `startTransition` for non-blocking updates
- Conditional rendering for loading/error states

**4. Responsive Design**
- Tailwind CSS utility classes
- Mobile-first approach
- Flexible grid layouts

---

## 7. Critical Code Flows

### 7.1 Search + Filter + Sort + Pagination Flow

```javascript
// 1. User types in search box
<SearchBar onChange={setQuery} />
  ↓
// 2. State updates
setQuery("john")
  ↓
// 3. useEffect detects dependency change
useEffect(() => fetchSales(), [query, filters, ...])
  ↓
// 4. API call with all params
const params = {
  q: query,
  region: filters.region.join(","),
  sortBy, sortDir, page, pageSize
}
await api.get("/sales", { params })
  ↓
// 5. Backend builds WHERE clause
WHERE LOWER(customerName) LIKE '%john%'
  AND region IN ('North', 'South')
ORDER BY date DESC
LIMIT 10 OFFSET 0
  ↓
// 6. Frontend updates state
setSales(data.content)
setTotalPages(data.totalPages)
  ↓
// 7. React re-renders table
<SalesTable sales={sales} />
```

### 7.2 Filter Processing Example

```javascript
// Input: "North, South, East"
// Step 1: Split by comma
["North", " South", " East"]
// Step 2: Trim whitespace
["North", "South", "East"]
// Step 3: Filter empty strings
["North", "South", "East"]
// Step 4: SQL IN clause
WHERE region IN ('North', 'South', 'East')
```

---

## 8. Scalability Considerations

### 8.1 Current Limitations
- **In-memory pagination:** Offset-based (slow for large offsets)
- **No caching:** Every request hits database
- **Single server:** No horizontal scaling

### 8.2 Future Enhancements
- **Cursor-based pagination** for better performance
- **Redis caching** for frequently accessed data
- **Database indexing** on filter columns
- **API rate limiting** for production
- **Connection pooling optimization**
- **Query result caching** in service layer

---

## 9. Security Measures

**Backend:**
- SQL injection prevention via Sequelize ORM
- Whitelist validation for sort fields
- CORS enabled for frontend origin
- Environment variable protection (.env)

**Frontend:**
- XSS prevention via React's escaping
- HTTPS for production deployment
- API key not exposed in frontend code

---

## 10. Testing Strategy (Recommended)

**Backend:**
- Unit tests for `saleService.js` (query building logic)
- Integration tests for API endpoints
- Database seed data for consistent testing

**Frontend:**
- Component unit tests (SearchBar, Filters)
- Integration tests for API calls
- E2E tests for critical user flows

---

## Summary

This architecture provides:
✅ **Clear separation of concerns** (3-tier backend, component-based frontend)  
✅ **Scalable data handling** (pagination, filtering, sorting)  
✅ **Maintainable codebase** (modular structure, single responsibility)  
✅ **Type-safe queries** (Sequelize ORM)  
✅ **Responsive UI** (React + Tailwind CSS)  
✅ **Efficient data flow** (RESTful API with optimized queries)