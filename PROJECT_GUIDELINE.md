# Finance Dashboard - Project Guideline

A concise guide to the project's functionalities, API integration, and code structure.

## Table of Contents

1. [Core Features](#core-features)
2. [Financial APIs](#financial-apis)
3. [Code Structure](#code-structure)
4. [Test Cases](#test-cases)

---

## Core Features

### 1. Widget Management
- **Add Widget**: Create widgets by connecting to any API
- **Remove Widget**: Delete unwanted widgets
- **Update Widget**: Modify widget configuration
- **Reorder Widgets**: Drag and drop to rearrange

**Test Case 1: Add Widget**
```
Action: Click "Add Widget" → Fill form → Add
Input: Name="Bitcoin", URL="/api/mock/card", Mode="card"
Expected: Widget appears on dashboard with data
```

### 2. Display Modes
- **Card View**: Key-value pairs display
- **Table View**: Sortable, searchable data table
- **Chart View**: Line chart for time-series data

**Test Case 2: Card Widget**
```
Action: Create card widget
Input: API="/api/mock/card", Fields=["price", "change"]
Expected: Card shows price and change values
```

**Test Case 3: Table Widget**
```
Action: Create table widget
Input: API="/api/mock/table", Field="root"
Expected: Table with 10 rows, sortable columns, pagination
```

**Test Case 4: Chart Widget**
```
Action: Create chart widget
Input: API="/api/mock/chart", Fields=["date", "price"]
Expected: Line chart with 30 data points
```

### 3. API Integration
- **Data Fetching**: Fetch from any REST API
- **Caching**: Intelligent caching with TTL
- **Error Handling**: Automatic error recovery
- **CORS Proxy**: Automatic proxy fallback

**Test Case 5: API Fetch**
```
Action: Widget fetches data
Input: URL="https://api.coinbase.com/v2/exchange-rates?currency=BTC"
Expected: Data retrieved and displayed
```

### 4. Theme Management
- **Dark/Light Mode**: Toggle between themes
- **Persistence**: Theme saved to localStorage

**Test Case 6: Theme Toggle**
```
Action: Click theme toggle
Input: Current theme="dark"
Expected: Switches to "light", persists after refresh
```

### 5. Export/Import
- **Export**: Download dashboard configuration as JSON
- **Import**: Load dashboard from JSON file

**Test Case 7: Export**
```
Action: Click "Export" button
Input: Dashboard with 3 widgets
Expected: JSON file downloaded with all configurations
```

**Test Case 8: Import**
```
Action: Click "Import" → Select JSON file
Input: Valid dashboard config
Expected: All widgets imported and displayed
```

---

## Financial APIs

### Recommended APIs

#### 1. Alpha Vantage
**URL Format**: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_KEY`

**Test Case 9: Alpha Vantage Integration**
```
Action: Create widget with Alpha Vantage API
Input: 
  - URL: "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY"
  - Fields: ["Global Quote.05. price", "Global Quote.09. change"]
Expected: Stock price and change displayed in card
```

**Response Structure**:
```json
{
  "Global Quote": {
    "01. symbol": "AAPL",
    "05. price": "150.25",
    "09. change": "2.50",
    "10. change percent": "1.69%"
  }
}
```

#### 2. Finnhub
**URL Format**: `https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_TOKEN`

**Test Case 10: Finnhub Integration**
```
Action: Create widget with Finnhub API
Input:
  - URL: "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_TOKEN"
  - Fields: ["c", "h", "l", "pc"]
Expected: Current price, high, low, previous close displayed
```

**Response Structure**:
```json
{
  "c": 150.25,
  "h": 152.00,
  "l": 148.50,
  "pc": 147.75
}
```

#### 3. Coinbase
**URL Format**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`

**Test Case 11: Coinbase Integration**
```
Action: Create widget with Coinbase API
Input:
  - URL: "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
  - Fields: ["data.currency", "data.rates.USD"]
Expected: Currency and USD rate displayed
```

**Response Structure**:
```json
{
  "data": {
    "currency": "BTC",
    "rates": {
      "USD": "45000.00"
    }
  }
}
```

#### 4. Indian APIs (Example)
**URL Format**: `https://api.example.com/indian-stocks?symbol=RELIANCE`

**Test Case 12: Indian API Integration**
```
Action: Create widget with Indian stock API
Input:
  - URL: "https://api.example.com/indian-stocks?symbol=RELIANCE"
  - Fields: ["price", "change", "volume"]
Expected: Indian stock data displayed
```

### Local Mock APIs

The project includes built-in mock APIs for testing:

- `/api/mock/card` - Card widget data
- `/api/mock/table` - Table widget data (10 stocks)
- `/api/mock/chart` - Chart widget data (30-day time series)
- `/api/mock/finance` - Finance card data
- `/api/mock/metrics` - Metrics dashboard data
- `/api/mock/users` - Users table data

**Test Case 13: Mock API**
```
Action: Use local mock API
Input: URL="/api/mock/card"
Expected: Instant response with sample data
```

---

## Code Structure

### Main Components

**`components/Dashboard.tsx`**
- Main dashboard container
- Handles widget grid layout
- Manages drag-and-drop
- Export/import functionality

**`components/AddWidgetModal.tsx`**
- Widget creation form
- API testing interface
- Field selection UI
- Display mode selection

**`components/widgets/WidgetCard.tsx`**
- Card view display
- Key-value pair rendering
- Refresh functionality
- Error/loading states

**`components/widgets/WidgetTable.tsx`**
- Table view display
- Sorting and searching
- Pagination
- Column management

**`components/widgets/WidgetChart.tsx`**
- Chart view display
- Line chart rendering
- Multi-series support
- Time-series handling

### State Management

**`store/dashboardStore.ts`**
- Zustand store for global state
- Widget CRUD operations
- Theme management
- Export/import functions
- localStorage persistence

**Key Functions**:
- `addWidget()` - Add new widget
- `removeWidget()` - Delete widget
- `updateWidget()` - Update widget config
- `reorderWidgets()` - Change widget order
- `exportConfig()` - Export to JSON
- `importConfig()` - Import from JSON

### API Utilities

**`utils/api.ts`**
- `fetchApiData()` - Main API fetching function
- `getNestedValue()` - Extract nested object values
- `flattenObject()` - Flatten API response for field selection

**Features**:
- Automatic caching
- CORS proxy fallback
- Request deduplication
- Error handling

**`utils/cache.ts`**
- `ApiCache` class - Cache management
- TTL-based expiration
- Automatic cleanup
- Cache statistics

**`utils/storage.ts`**
- `saveToStorage()` - Save to localStorage
- `loadFromStorage()` - Load from localStorage

### API Routes

**`app/api/proxy/route.ts`**
- Server-side proxy for CORS issues
- Forwards requests to external APIs
- Returns JSON response

**`app/api/mock/*/route.ts`**
- Mock API endpoints for testing
- Returns sample financial data
- Simulates network delay

---

## Test Cases Summary

### Widget Operations
1. ✅ Add widget with valid API
2. ✅ Remove widget
3. ✅ Update widget configuration
4. ✅ Reorder widgets via drag-and-drop

### Display Modes
5. ✅ Card view displays key-value pairs
6. ✅ Table view shows sortable data
7. ✅ Chart view renders line chart
8. ✅ Multi-series chart support

### API Integration
9. ✅ Fetch from Alpha Vantage
10. ✅ Fetch from Finnhub
11. ✅ Fetch from Coinbase
12. ✅ Use local mock APIs
13. ✅ Handle API errors
14. ✅ CORS proxy fallback

### Features
15. ✅ Theme toggle (dark/light)
16. ✅ Export configuration
17. ✅ Import configuration
18. ✅ Data caching
19. ✅ Auto-refresh intervals
20. ✅ Responsive design

---

## Quick Start Examples

### Example 1: Bitcoin Price Card
```
Name: Bitcoin Price
URL: https://api.coinbase.com/v2/exchange-rates?currency=BTC
Mode: Card
Fields: data.currency, data.rates.USD
Refresh: 30 seconds
```

### Example 2: Stock Table
```
Name: Stock Prices
URL: /api/mock/table
Mode: Table
Fields: root (array)
Refresh: 60 seconds
```

### Example 3: Price Chart
```
Name: Price History
URL: /api/mock/chart
Mode: Chart
Fields: date (X-axis), price (Y-axis)
Refresh: 300 seconds
```

### Example 4: Alpha Vantage Stock
```
Name: AAPL Stock
URL: https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY
Mode: Card
Fields: Global Quote.05. price, Global Quote.09. change
Refresh: 60 seconds
```

---

## Implementation Overview

### Data Flow
1. User creates widget → Store updated → Saved to localStorage
2. Widget fetches data → Cache checked → API called if needed
3. Data received → Widget updated → UI re-renders
4. Auto-refresh → Interval triggers → Data refreshed

### Key Technologies
- **Next.js 14** - React framework with App Router
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Recharts** - Chart library
- **@dnd-kit** - Drag and drop
- **Tailwind CSS** - Styling

### File Organization
```
app/              - Next.js pages and API routes
components/       - React components
store/            - State management
utils/            - Helper functions
types/            - TypeScript types
```

---

## Expected Behaviors

- Widgets persist after page refresh
- Data auto-refreshes at set intervals
- Errors are displayed clearly
- Cache improves performance
- Theme preference is saved
- Export/import works seamlessly
- Drag-and-drop reordering is smooth
- Responsive on all devices

---

## Notes

- All APIs must return JSON
- Use mock APIs for testing without external dependencies
- CORS issues are handled automatically via proxy
- Cache TTL is calculated as 80% of refresh interval
- Maximum 50 widgets supported
- Maximum cache size: 50 entries
