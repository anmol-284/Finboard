# Finance Dashboard

A simple, customizable dashboard to monitor your financial data in real-time. Connect to any financial API and create beautiful widgets to track stocks, cryptocurrencies, or any financial metrics.

> ✅ **Project Status**: Complete and ready to use

## What Can You Do?

- **Create Custom Widgets** - Connect to any financial API and display data your way
- **Three Display Modes** - Show data as cards, tables, or charts
- **Drag & Drop** - Easily rearrange widgets to organize your dashboard
- **Auto-Refresh** - Data updates automatically at intervals you choose
- **Dark/Light Mode** - Switch themes to match your preference
- **Save Your Setup** - Your dashboard is saved automatically and loads when you return

## Quick Start

### Step 1: Install
```bash
npm install
```

### Step 2: Run
```bash
npm run dev
```

### Step 3: Open
Visit [http://localhost:3000](http://localhost:3000) in your browser

That's it! You're ready to go.

## How to Use

### Creating Your First Widget

1. Click the **"+ Add Widget"** button
2. Give it a name (like "Bitcoin Price")
3. Paste an API URL (try: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`)
4. Click **"Test"** to make sure it works
5. Choose how to display it:
   - **Card** - Simple key-value display
   - **Table** - Sortable data table
   - **Chart** - Visual line graph
6. Pick which data fields to show
7. Set how often to update (in seconds)
8. Click **"Add Widget"**

### Managing Widgets

- **Move**: Drag the widget by the handle (appears when you hover)
- **Refresh**: Click the refresh icon to get latest data
- **Settings**: Click the settings icon to change widget configuration
- **Delete**: Click the trash icon to remove a widget

## Example APIs to Try

These work right away - no setup needed:

- **Bitcoin Price**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`
- **Stock Data**: Use any public financial API that returns JSON
- **Local Mock Data**: Try `/api/mock/card`, `/api/mock/table`, or `/api/mock/chart`

## What You Need

- **Node.js** version 18 or higher
- Basic knowledge of how to run commands in a terminal
- (Optional) An API key if you want to use APIs that require authentication

## Project Structure

```
finboard/
├── app/              # Main application files
├── components/       # UI components (dashboard, widgets, etc.)
├── store/            # Data storage and state management
├── utils/            # Helper functions
└── types/            # Type definitions
```

## Technologies

Built with modern web technologies:
- **Next.js** - Web framework
- **TypeScript** - Programming language
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Recharts** - Chart library

## Need Help?

- Found a bug? [Open an issue](https://github.com/anmol-284/Finboard/issues)
- Want to contribute? Pull requests are welcome!
- Questions? Check the code comments or open a discussion

## License

MIT License - Feel free to use this project for any purpose.

---

**Made with ❤️ using Next.js, TypeScript, and Tailwind CSS**
