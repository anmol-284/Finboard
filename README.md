# Finance Dashboard

A customizable real-time finance monitoring dashboard built with Next.js, TypeScript, and Tailwind CSS. Connect to various financial APIs and create custom widgets to visualize your financial data.

## Features

### 🎯 Core Features

1. **Widget Management System**
   - ✅ Add widgets by connecting to any financial API
   - ✅ Remove unwanted widgets
   - ✅ Drag-and-drop to rearrange widget positions
   - ✅ Configure each widget individually

2. **Widget Types**
   - **Card View**: Display key metrics in a card format
   - **Table View**: Show data in a sortable, searchable table
   - **Chart View**: Visualize data with line charts

3. **API Integration**
   - Dynamic data mapping from API responses
   - Interactive field selection interface
   - Real-time data updates with configurable intervals
   - Intelligent data caching

4. **User Interface**
   - Dark/Light theme switching
   - Fully responsive design
   - Loading and error states
   - Modern, intuitive UI

5. **Data Persistence**
   - Browser localStorage integration
   - Dashboard state persists across sessions
   - Automatic state recovery on page refresh

## Technologies Used

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Drag & Drop**: @dnd-kit
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A financial API key (optional, for production use)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding a Widget

1. Click the **"+ Add Widget"** button in the top right
2. Enter a widget name (e.g., "Bitcoin Price")
3. Enter an API URL (e.g., `https://api.coinbase.com/v2/exchange-rates?currency=BTC`)
4. Click **"Test"** to verify the API connection
5. Select a display mode: Card, Table, or Chart
6. Choose the fields you want to display from the API response
7. Set the refresh interval (in seconds)
8. Click **"Add Widget"** to create the widget

### Managing Widgets

- **Refresh**: Hover over a widget and click the refresh icon
- **Delete**: Hover over a widget and click the trash icon
- **Reorder**: Drag widgets by their handle (appears on hover)

### Supported APIs

The dashboard works with any REST API that returns JSON data. Some examples:

- **Coinbase API**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`
- **Alpha Vantage**: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_KEY`
- **Finnhub**: `https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_TOKEN`
- **Any custom financial API** that returns JSON

### API Requirements

- Must return JSON data
- Should be accessible via GET request
- For production use, consider using a backend proxy to handle CORS issues

## Project Structure

```
finboard/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── AddWidgetModal.tsx # Widget creation modal
│   ├── ThemeToggle.tsx    # Theme switcher
│   └── widgets/           # Widget components
│       ├── WidgetCard.tsx
│       ├── WidgetTable.tsx
│       └── WidgetChart.tsx
├── store/                 # State management
│   └── dashboardStore.ts  # Zustand store
├── types/                 # TypeScript types
│   └── widget.ts          # Widget type definitions
├── utils/                 # Utility functions
│   ├── api.ts             # API helpers
│   └── storage.ts         # LocalStorage helpers
└── package.json           # Dependencies
```

## API Key Management

For APIs that require authentication:

1. Create a `.env.local` file in the root directory
2. Add your API keys:
```
NEXT_PUBLIC_API_KEY=your_key_here
```
3. Use them in your API URLs (client-side) or create API routes for server-side usage

**Note**: For production, use Next.js API routes to securely handle API keys on the server side.

## CORS Issues

If you encounter CORS errors when fetching from APIs:

1. **Development**: Use a CORS proxy or browser extension
2. **Production**: Create Next.js API routes to proxy requests server-side

Example API route:
```typescript
// app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiUrl = searchParams.get('url');
  
  const response = await fetch(apiUrl!);
  const data = await response.json();
  
  return Response.json(data);
}
```

## Features Roadmap

- [ ] Real-time WebSocket support
- [ ] Dashboard templates
- [ ] Export/import dashboard configurations
- [ ] Widget templates
- [ ] Custom date ranges for charts
- [ ] Multiple chart types (candlestick, bar, etc.)
- [ ] Widget collaboration/sharing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)
