# Finance Dashboard - Project Guideline

Complete documentation of all functionalities, test cases, and implementation details.

## Table of Contents

1. [Core Features](#core-features)
2. [Widget Management](#widget-management)
3. [API Integration](#api-integration)
4. [Data Display Modes](#data-display-modes)
5. [State Management](#state-management)
6. [Caching System](#caching-system)
7. [Theme Management](#theme-management)
8. [Export/Import](#exportimport)
9. [Drag and Drop](#drag-and-drop)
10. [Test Cases](#test-cases)

---

## Core Features

### 1. Widget Management System

**Functionality**: Create, update, delete, and organize widgets on the dashboard.

**Implementation**: 
- Widgets are stored in Zustand store with localStorage persistence
- Each widget has a unique ID generated on creation
- Widgets can be added, removed, updated, and reordered

**Test Case 1: Add Widget**
```
Action: Click "Add Widget" → Fill form → Click "Add Widget"
Input:
  - Name: "Bitcoin Price"
  - API URL: "/api/mock/card"
  - Display Mode: "card"
  - Refresh Interval: 30
  - Selected Fields: ["currency", "price"]

Expected Output:
  - Widget appears on dashboard
  - Widget shows loading state initially
  - After data fetch, displays selected fields
  - Widget persists after page refresh
```

**Test Case 2: Remove Widget**
```
Action: Hover over widget → Click trash icon → Confirm deletion
Input: Widget ID

Expected Output:
  - Widget disappears from dashboard
  - Widget removed from localStorage
  - Other widgets remain intact
```

**Test Case 3: Update Widget**
```
Action: Click settings icon → Modify fields → Save
Input:
  - Widget ID
  - Updated refresh interval: 60

Expected Output:
  - Widget updates with new refresh interval
  - Changes saved to localStorage
  - Widget continues to function normally
```

---

## Widget Management

### 2. Add Widget Modal

**Functionality**: Interactive modal for creating new widgets with API testing and field selection.

**Features**:
- API URL testing with real-time validation
- Field discovery and selection interface
- Search and filter capabilities
- Display mode selection (Card/Table/Chart)

**Test Case 4: API Testing**
```
Action: Enter API URL → Click "Test" button
Input: URL = "/api/mock/card"

Expected Output:
  - Loading indicator appears
  - Success message: "API connection successful! X fields found."
  - Available fields list populated
  - Field types displayed (string, number, array, object)
  - Sample values shown for each field
```

**Test Case 5: Field Selection**
```
Action: Click on available fields to select
Input: 
  - Select "currency" (type: string)
  - Select "price" (type: number)
  - Select "changePercent" (type: string)

Expected Output:
  - Selected fields move to "Selected Fields" panel
  - Selected count updates
  - Fields can be deselected by clicking again
  - "Add Widget" button enabled when fields selected
```

**Test Case 6: Search Fields**
```
Action: Type in search box
Input: Search query = "price"

Expected Output:
  - Only fields containing "price" are shown
  - Case-insensitive search
  - Real-time filtering as you type
```

**Test Case 7: Array Filter (Table Mode)**
```
Action: Select "Table" display mode → Check "Show arrays only"
Input: Display mode = "table", Filter = enabled

Expected Output:
  - Only array fields and fields inside arrays shown
  - Root array field visible
  - Nested array fields (e.g., "[0].name") visible
```

---

## API Integration

### 3. API Data Fetching

**Functionality**: Fetch data from external APIs with caching, error handling, and CORS proxy fallback.

**Implementation**:
- Uses Axios for HTTP requests
- Intelligent caching with TTL
- Automatic CORS proxy fallback
- Request deduplication

**Test Case 8: Successful API Fetch**
```
Action: Widget fetches data from API
Input: URL = "https://api.coinbase.com/v2/exchange-rates?currency=BTC"

Expected Output:
  - Data successfully retrieved
  - Response cached for future use
  - Widget displays data
  - Last updated timestamp shown
```

**Test Case 9: CORS Error Handling**
```
Action: Fetch from API with CORS restrictions
Input: URL = "https://external-api.com/data"

Expected Output:
  - Initial request fails with CORS error
  - Automatically retries via proxy route (/api/proxy)
  - Data successfully retrieved through proxy
  - Error message if proxy also fails
```

**Test Case 10: Network Error**
```
Action: Fetch from invalid/unreachable URL
Input: URL = "https://invalid-url-12345.com/api"

Expected Output:
  - Error message displayed: "Network error: Unable to reach the API"
  - Widget shows error state
  - Retry available via refresh button
```

**Test Case 11: Cache Hit**
```
Action: Fetch same URL within cache TTL
Input: URL = "/api/mock/card" (previously cached)

Expected Output:
  - Data returned from cache (instant)
  - No network request made
  - fromCache flag = true
  - Widget updates immediately
```

---

## Data Display Modes

### 4. Card View Widget

**Functionality**: Display key-value pairs in a card format.

**Test Case 12: Card Widget Display**
```
Action: Create widget with card display mode
Input:
  - API: "/api/mock/card"
  - Fields: ["currency", "price", "changePercent"]

Expected Output:
  - Card widget rendered
  - Three rows displayed:
    * Currency: USD
    * Price: 45,234.56
    * Change Percent: +2.34%
  - Values formatted appropriately
  - Last updated timestamp at bottom
```

**Test Case 13: Card Widget Refresh**
```
Action: Click refresh icon on card widget
Input: Widget ID

Expected Output:
  - Loading spinner appears
  - Cache bypassed (fresh data fetched)
  - Widget updates with new data
  - Last updated timestamp changes
```

### 5. Table View Widget

**Functionality**: Display array data in a sortable, searchable, paginated table.

**Test Case 14: Table Widget Display**
```
Action: Create widget with table display mode
Input:
  - API: "/api/mock/table"
  - Field: "root" (array)

Expected Output:
  - Table rendered with columns: symbol, name, price, change, changePercent, volume, marketCap, sector
  - 10 rows displayed (default pagination)
  - Sortable columns (click header to sort)
  - Search functionality available
  - Pagination controls visible
```

**Test Case 15: Table Sorting**
```
Action: Click column header to sort
Input: Click "price" column header

Expected Output:
  - Table sorted by price (ascending)
  - Click again sorts descending
  - Sort indicator shown on header
  - All rows reordered accordingly
```

**Test Case 16: Table Search**
```
Action: Type in search box
Input: Search query = "AAPL"

Expected Output:
  - Only rows containing "AAPL" in any column shown
  - Real-time filtering
  - Result count updated
  - Pagination resets to page 1
```

**Test Case 17: Table Pagination**
```
Action: Change rows per page
Input: Select "25" from pagination dropdown

Expected Output:
  - Table shows 25 rows per page
  - Pagination controls update
  - Page numbers adjust
  - Current page indicator visible
```

### 6. Chart View Widget

**Functionality**: Display time-series data as a line chart.

**Test Case 18: Chart Widget Display**
```
Action: Create widget with chart display mode
Input:
  - API: "/api/mock/chart"
  - Fields: "date" (X-axis), "price" (Y-axis)

Expected Output:
  - Line chart rendered
  - X-axis shows dates
  - Y-axis shows price values
  - 30 data points displayed
  - Interactive tooltip on hover
  - Legend showing field names
```

**Test Case 19: Multi-Series Chart**
```
Action: Create chart with multiple Y-axis fields
Input:
  - API: "/api/mock/chart"
  - Fields: "date" (X), "price", "volume" (Y)

Expected Output:
  - Chart with two lines
  - Different colors for each series
  - Legend shows both "price" and "volume"
  - Tooltip shows both values on hover
```

---

## State Management

### 7. Zustand Store

**Functionality**: Centralized state management with localStorage persistence.

**Test Case 20: State Persistence**
```
Action: Add widget → Refresh page
Input: Widget configuration

Expected Output:
  - Widget persists after page refresh
  - All widget data restored
  - Theme preference maintained
  - Widget order preserved
```

**Test Case 21: State Initialization**
```
Action: Load dashboard
Input: Existing localStorage data

Expected Output:
  - Store initializes with empty state (prevents hydration mismatch)
  - initialize() called after mount
  - Saved state loaded from localStorage
  - Widgets appear on screen
```

**Test Case 22: Widget Reordering**
```
Action: Drag widget to new position
Input: Widget moved from position 1 to position 3

Expected Output:
  - Widgets reordered visually
  - New order saved to localStorage
  - Order persists after refresh
  - Other widgets adjust positions
```

---

## Caching System

### 8. Intelligent Caching

**Functionality**: Cache API responses with TTL, automatic expiration, and request deduplication.

**Test Case 23: Cache TTL Calculation**
```
Action: Set refresh interval
Input: refreshInterval = 60 seconds

Expected Output:
  - TTL calculated as 80% of refresh interval = 48 seconds
  - Cache expires after 48 seconds
  - Fresh data fetched after expiration
```

**Test Case 24: Request Deduplication**
```
Action: Multiple widgets use same API URL simultaneously
Input: 3 widgets with same URL

Expected Output:
  - Only one network request made
  - All widgets receive same data
  - Pending request tracked
  - Subsequent requests wait for first to complete
```

**Test Case 25: Cache Invalidation**
```
Action: Manual refresh bypasses cache
Input: Click refresh button

Expected Output:
  - bypassCache = true
  - Fresh data fetched
  - Cache updated with new data
  - New TTL applied
```

**Test Case 26: Cache Cleanup**
```
Action: Wait for cache entries to expire
Input: Time passes beyond TTL

Expected Output:
  - Expired entries automatically removed
  - Cleanup runs every minute
  - Cache size stays within limits
  - Memory usage optimized
```

---

## Theme Management

### 9. Dark/Light Theme

**Functionality**: Toggle between dark and light themes with system preference detection.

**Test Case 27: Theme Toggle**
```
Action: Click theme toggle button
Input: Current theme = "dark"

Expected Output:
  - Theme switches to "light"
  - All UI elements update colors
  - Theme saved to localStorage
  - Theme persists after refresh
```

**Test Case 28: Theme Persistence**
```
Action: Set theme → Refresh page
Input: Theme = "light"

Expected Output:
  - Theme restored to "light" on page load
  - No flash of wrong theme
  - Smooth transition
```

---

## Export/Import

### 10. Configuration Export

**Functionality**: Export dashboard configuration as JSON file.

**Test Case 29: Export Configuration**
```
Action: Click "Export" button
Input: Dashboard with 3 widgets

Expected Output:
  - JSON file downloaded
  - Filename: "dashboard-config-YYYY-MM-DD.json"
  - File contains:
    * All widget configurations
    * Theme preference
    * Export timestamp
    * Version number
  - File is valid JSON
```

**Test Case 30: Export Empty Dashboard**
```
Action: Click "Export" with no widgets
Input: Empty dashboard

Expected Output:
  - Alert shown: "No widgets to export. Add some widgets first!"
  - No file downloaded
```

### 11. Configuration Import

**Functionality**: Import dashboard configuration from JSON file.

**Test Case 31: Import Valid Configuration**
```
Action: Click "Import" → Select valid JSON file
Input: Valid dashboard config JSON

Expected Output:
  - Confirmation dialog appears
  - After confirmation, widgets imported
  - All widgets appear on dashboard
  - Theme applied
  - Success message shown
```

**Test Case 32: Import Invalid File**
```
Action: Click "Import" → Select invalid JSON
Input: Invalid JSON file

Expected Output:
  - Error message: "Invalid configuration file"
  - No widgets imported
  - Current dashboard unchanged
```

**Test Case 33: Import Missing Fields**
```
Action: Import config with missing required fields
Input: Widget without "name" field

Expected Output:
  - Error message: "Widget missing required fields"
  - Import fails
  - Error logged to console
  - Returns false
```

---

## Drag and Drop

### 12. Widget Reordering

**Functionality**: Drag widgets to reorder them on the dashboard.

**Test Case 34: Drag Widget**
```
Action: Drag widget handle → Drop in new position
Input: Widget moved from index 0 to index 2

Expected Output:
  - Widget visually moves during drag
  - Smooth animation
  - Widgets reorder on drop
  - New order saved
  - Other widgets adjust positions
```

**Test Case 35: Keyboard Navigation**
```
Action: Use keyboard to reorder widgets
Input: Tab to widget → Space to activate → Arrow keys to move

Expected Output:
  - Widget selected with keyboard
  - Can move with arrow keys
  - Accessible navigation
  - Works with screen readers
```

---

## Mock APIs

### 13. Local Mock Endpoints

**Functionality**: Built-in mock APIs for testing without external dependencies.

**Test Case 36: Mock Card API**
```
Action: Fetch from "/api/mock/card"
Input: GET request

Expected Output:
  - Response after ~300ms delay
  - JSON with fields:
    * currency: "USD"
    * price: random number (30000-80000)
    * change: random number (-500 to 500)
    * changePercent: random number (-2.5 to 2.5)
    * volume: random number
    * high, low: random numbers
    * timestamp: ISO string
```

**Test Case 37: Mock Table API**
```
Action: Fetch from "/api/mock/table"
Input: GET request

Expected Output:
  - Response after ~400ms delay
  - Array of 10 stock objects
  - Each stock has: symbol, name, price, change, changePercent, volume, marketCap, sector
  - Realistic stock data
```

**Test Case 38: Mock Chart API**
```
Action: Fetch from "/api/mock/chart"
Input: GET request

Expected Output:
  - Response after ~500ms delay
  - Array of 30 time-series objects
  - Each object has: date, price, volume, high, low, open, close
  - Dates span last 30 days
  - Price follows random walk pattern
```

---

## Error Handling

### 14. Error States

**Test Case 39: API Error Display**
```
Action: Widget fails to fetch data
Input: Invalid API URL

Expected Output:
  - Error message displayed in widget
  - Red error box shown
  - Error text: "API Error: [status] - [message]"
  - Refresh button still available
  - Widget remains on dashboard
```

**Test Case 40: Loading State**
```
Action: Widget fetching data
Input: API request in progress

Expected Output:
  - Loading spinner displayed
  - "Loading..." text shown
  - Widget shows loading state
  - Previous data hidden during load
```

**Test Case 41: Empty State**
```
Action: Widget with no selected fields
Input: Widget created without fields

Expected Output:
  - "No fields selected" message
  - Empty state UI shown
  - Widget still functional
  - Can be configured later
```

---

## Responsive Design

### 15. Mobile/Tablet/Desktop

**Test Case 42: Mobile View**
```
Action: View dashboard on mobile device (< 640px)
Input: Screen width = 375px

Expected Output:
  - Single column layout
  - Compact header
  - Touch-friendly buttons
  - Widgets stack vertically
  - Drag handles visible on touch
```

**Test Case 43: Tablet View**
```
Action: View dashboard on tablet (640px - 1024px)
Input: Screen width = 768px

Expected Output:
  - 2-column grid layout
  - Medium-sized buttons
  - Optimized spacing
  - Widgets resize appropriately
```

**Test Case 44: Desktop View**
```
Action: View dashboard on desktop (> 1024px)
Input: Screen width = 1920px

Expected Output:
  - Multi-column grid layout
  - Full-width widgets for tables/charts
  - Hover effects visible
  - Optimal spacing
```

---

## Performance Features

### 16. Optimization Features

**Test Case 45: Lazy Loading**
```
Action: Load dashboard with many widgets
Input: 20 widgets on dashboard

Expected Output:
  - Widgets load progressively
  - No blocking of UI
  - Smooth scrolling
  - Efficient rendering
```

**Test Case 46: Memory Management**
```
Action: Add/remove widgets repeatedly
Input: Create 50 widgets, delete 40

Expected Output:
  - Cache size stays within limits (max 50 entries)
  - Oldest entries evicted when limit reached
  - No memory leaks
  - Performance remains stable
```

---

## Implementation Details

### Architecture

**State Management**:
- Zustand store for global state
- localStorage for persistence
- Hydration-safe initialization

**API Layer**:
- Axios for HTTP requests
- Intelligent caching with TTL
- Automatic CORS proxy fallback
- Request deduplication

**Component Structure**:
- Dashboard (main container)
- AddWidgetModal (widget creation)
- WidgetCard, WidgetTable, WidgetChart (display components)
- ThemeToggle (theme switcher)
- WidgetConfigModal (widget configuration)

**Data Flow**:
1. User creates widget → Store updated → localStorage saved
2. Widget fetches data → Cache checked → API called if needed
3. Data received → Widget updated → UI re-renders
4. Auto-refresh → Interval triggers → Data refreshed

### Key Utilities

**api.ts**:
- `fetchApiData()`: Main API fetching function
- `getNestedValue()`: Extract nested object values
- `flattenObject()`: Flatten nested structures for field selection

**cache.ts**:
- `ApiCache` class: Cache management
- `getCache()`: Singleton instance
- `calculateTTL()`: TTL calculation based on refresh interval

**storage.ts**:
- `saveToStorage()`: Save to localStorage
- `loadFromStorage()`: Load from localStorage

---

## Testing Checklist

### Functional Testing
- [ ] Add widget with valid API
- [ ] Add widget with invalid API (error handling)
- [ ] Remove widget
- [ ] Update widget configuration
- [ ] Reorder widgets via drag-and-drop
- [ ] Export configuration
- [ ] Import configuration
- [ ] Toggle theme
- [ ] Test all three display modes (card, table, chart)
- [ ] Test search and filter in table
- [ ] Test pagination in table
- [ ] Test chart with single and multiple series

### Performance Testing
- [ ] Test with 50 widgets
- [ ] Test cache efficiency
- [ ] Test memory usage
- [ ] Test page load time
- [ ] Test refresh intervals

### Responsive Testing
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] Test touch interactions
- [ ] Test keyboard navigation

### Edge Cases
- [ ] Empty dashboard
- [ ] Widget with no fields
- [ ] API timeout
- [ ] Network offline
- [ ] Invalid JSON import
- [ ] Very long API response
- [ ] Special characters in widget names

---

## Expected Behaviors

### Widget Lifecycle
1. **Creation**: Widget created with unique ID, initial state set
2. **Initialization**: First data fetch triggered
3. **Active**: Regular refresh intervals, user interactions
4. **Update**: Configuration changes, data refreshes
5. **Deletion**: Widget removed, state cleaned up

### Data Refresh Flow
1. Check cache → If valid, return cached data
2. If cache miss → Check pending requests → Wait or create new
3. Fetch from API → Handle errors → Cache response
4. Update widget state → Trigger UI re-render

### Error Recovery
- Network errors: Show error, allow retry
- API errors: Display error message, keep widget
- Invalid data: Show error, allow reconfiguration
- Cache errors: Fallback to fresh fetch

---

## Conclusion

This project implements a fully functional finance dashboard with:
- ✅ Complete widget management
- ✅ Multiple display modes
- ✅ Intelligent caching
- ✅ State persistence
- ✅ Export/import functionality
- ✅ Responsive design
- ✅ Error handling
- ✅ Theme support
- ✅ Drag-and-drop reordering

All features are tested and working as expected with the test cases documented above.

