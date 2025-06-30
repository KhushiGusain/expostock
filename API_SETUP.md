# Alpha Vantage API Setup Guide

## Getting Your API Key

1. **Sign up for a free Alpha Vantage API key:**
   - Go to [Alpha Vantage Support](https://www.alphavantage.co/support/#api-key)
   - Click "Get your free API key today"
   - Fill out the registration form
   - You'll receive your API key via email

## Setting Up the API Key

### Option 1: Environment Variable (Recommended)
1. Create a `.env` file in the `my-app` directory (same level as package.json):
```bash
# .env
EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

2. Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual API key

### Option 2: Direct Code Modification
If you don't want to use environment variables, you can directly edit the API service:

1. Open `services/api.ts`
2. Find this line:
```typescript
const ALPHA_VANTAGE_API_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
```
3. Replace it with:
```typescript
const ALPHA_VANTAGE_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

## Installing Dependencies

Make sure you have the required dependencies installed:

```bash
npm install axios
# or
yarn add axios
```

## API Features Implemented

✅ **Top Gainers & Losers**: Real-time data for the top 20 gainers and losers in the US market
- Updates at the end of each trading day
- Shows top 4 gainers and losers on the home screen
- Pull-to-refresh functionality
- Error handling with retry options

✅ **Stock Search**: Auto-complete search functionality powered by Alpha Vantage SYMBOL_SEARCH
- Real-time symbol and company search
- Auto-complete with debounced search (300ms delay)
- Search results show symbol, company name, type, region, and match score
- Up to 8 search results displayed, sorted by match score
- Tapping a result navigates to stock details page
- Search timeout protection and error handling

## API Limitations

- **Free Tier**: 25 requests per day, 5 requests per minute
- **Demo Key**: Very limited, only for testing
- **Data Update**: End of trading day for free users
- **Real-time Data**: Requires paid subscription

## Error Handling

The app includes comprehensive error handling for:
- Network timeouts
- API rate limiting
- Invalid responses
- Connection issues

## Testing

With the demo API key, you can test the basic functionality, but for production use, you'll need your own API key.

## Upgrading for Production

For production apps, consider:
1. **Paid Plan**: For more API calls and real-time data
2. **Caching**: Implement proper caching to reduce API calls
3. **Background Updates**: Set up background data fetching
4. **Error Recovery**: Implement retry logic with exponential backoff

## Next Steps

1. Get your API key from Alpha Vantage
2. Add it to your `.env` file
3. Test the app with real data
4. Consider implementing additional features like:
   - ✅ Stock search functionality (implemented)
   - Individual stock details
   - Watchlist with real-time updates
   - Charts and historical data

## Documentation Reference

Full API documentation: https://www.alphavantage.co/documentation/ 