# Finance Dashboard - Example API Configurations

This document provides examples of how to configure widgets with different financial APIs.

## Coinbase API - Bitcoin Exchange Rates

**Widget Name**: Bitcoin Price  
**API URL**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`  
**Display Mode**: Card  
**Refresh Interval**: 30 seconds  
**Selected Fields**:
- `data.currency`
- `data.rates.USD`
- `data.rates.EUR`
- `data.rates.INR`

## Alpha Vantage - Stock Quote

**Widget Name**: IBM Stock Quote  
**API URL**: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY`  
**Display Mode**: Card  
**Refresh Interval**: 60 seconds  
**Selected Fields**:
- `['Global Quote']['01. symbol']`
- `['Global Quote']['05. price']`
- `['Global Quote']['09. change']`
- `['Global Quote']['10. change percent']`

**Note**: Replace `YOUR_API_KEY` with your actual Alpha Vantage API key from https://www.alphavantage.co/support/#api-key

## Finnhub - Real-time Quote

**Widget Name**: AAPL Quote  
**API URL**: `https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_TOKEN`  
**Display Mode**: Card  
**Refresh Interval**: 30 seconds  
**Selected Fields**:
- `c` (current price)
- `h` (high)
- `l` (low)
- `pc` (previous close)

**Note**: Replace `YOUR_TOKEN` with your Finnhub API token from https://finnhub.io/

## Table View - Multiple Stocks

For table view, you'll need an API that returns an array of objects. Example:

**Widget Name**: Stock Prices  
**API URL**: Your custom API endpoint that returns JSON array  
**Display Mode**: Table  
**Refresh Interval**: 60 seconds  
**Selected Fields**: Select the array field (e.g., `data` or `stocks`)

Example API Response:
```json
[
  {
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.50,
    "changePercent": 1.69
  },
  {
    "symbol": "MSFT",
    "price": 300.00,
    "change": -1.25,
    "changePercent": -0.41
  }
]
```

## Chart View - Time Series Data

For chart view, you need time series data. Example:

**Widget Name**: Price History  
**API URL**: Your API that returns time series data  
**Display Mode**: Chart  
**Refresh Interval**: 300 seconds (5 minutes)  
**Selected Fields**: 
- First field: Time/Date field (x-axis)
- Additional fields: Value fields (y-axis lines)

Example API Response:
```json
[
  {
    "date": "2024-01-01",
    "price": 100.00,
    "volume": 1000000
  },
  {
    "date": "2024-01-02",
    "price": 102.50,
    "volume": 1200000
  }
]
```

## Tips

1. **CORS Issues**: If you encounter CORS errors, the dashboard will automatically try to use a proxy. For production, consider setting up your own backend proxy.

2. **API Rate Limits**: Be mindful of API rate limits. Set appropriate refresh intervals to avoid hitting limits.

3. **Field Selection**: 
   - For Card view: Select scalar values (numbers, strings)
   - For Table view: Select an array field
   - For Chart view: Select time series data with date/time and numeric values

4. **Error Handling**: The dashboard will show error messages if API calls fail. Check the error message for details.

5. **Testing**: Always click "Test" button before adding a widget to verify the API connection works.

## Free API Resources

- **Coinbase**: No API key required for public endpoints
- **Alpha Vantage**: Free tier available (500 requests/day)
- **Finnhub**: Free tier available (60 requests/minute)
- **Yahoo Finance**: Can be accessed through various proxies/APIs
- **IEX Cloud**: Free tier available for basic stock data

## Troubleshooting

### API returns data but fields don't show
- Check the field paths carefully
- Use the "Test" button to see the API response structure
- Make sure you're selecting the correct field paths

### CORS errors
- The dashboard will try to use a proxy automatically
- For production, set up your own Next.js API route as a proxy
- Some APIs require server-side requests

### Data not updating
- Check the refresh interval setting
- Verify the API URL is correct
- Check browser console for errors
- Ensure the API endpoint is accessible
