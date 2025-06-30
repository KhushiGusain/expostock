# 📈 StockWatch – React Native App (Expo)

This is a React Native app (built with Expo) for a stock/ETF tracking platform. The app replicates the exact UI design provided and is designed to simulate a broking platform interface with a clean UI and core functionality ready for [AlphaVantage API](https://www.alphavantage.co/) integration.

## ✅ Completed Features

### 🧭 Navigation
- **Bottom Tab Navigation** with green theme
  - `Home` - Stock tracking dashboard
  - `Watchlist` - User's saved watchlists

### 🏠 Home Screen 
- **Header section** with:
  - User profile picture and welcome message
  - User name display ("Sophia Calzoni")
  - Notification bell icon
- **Search bar** with search icon and placeholder
- **Top Gainers** section with "See All" button
- **Top Losers** section with "See All" button
- **Stock cards** displaying:
  - Company icons (differentiated by sector)
  - Stock symbols (INFY, TCS, HDFCBANK, etc.)
  - Company names
  - Current prices in Indian Rupees (₹)
  - Percentage changes with colored indicators
  - Green for gains, red for losses

### 📱 Watchlist Screen
- Clean header with "Watchlist" title
- Empty state with helpful messaging
- Ready for watchlist functionality

### 🎨 UI Components Created
- **StockCard** - Reusable stock display component
- **Loading** - Loading state component
- **Error** - Error state component with retry functionality
- **WatchlistContext** - State management for watchlists

### 🔧 Infrastructure
- **API Service** - Complete AlphaVantage API integration setup
- **Cache Manager** - Local data caching with expiry
- **Constants** - App-wide constants and configuration
- **TypeScript** - Full type safety throughout

## 📁 Project Structure

```
StockWatch/
├── app/
│   ├── _layout.tsx                 # Root layout with providers
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Tab navigation setup
│   │   ├── index.tsx              # Home screen (exact UI match)
│   │   └── explore.tsx            # Watchlist screen
├── components/
│   ├── StockCard.tsx              # Stock display component
│   ├── Loading.tsx                # Loading state component
│   └── Error.tsx                  # Error state component
├── contexts/
│   └── WatchlistContext.tsx       # Watchlist state management
├── services/
│   └── api.ts                     # AlphaVantage API service
├── utils/
│   ├── cache.ts                   # Local caching utility
│   └── constants.ts               # App constants
└── assets/                        # Images and fonts
```

## 🎯 Exact UI Implementation

### ✅ Design Match Checklist
- [x] Header with profile picture and notification icon
- [x] "Welcome back Sophia Calzoni" greeting
- [x] Search bar with proper styling
- [x] "Top Gainers" and "Top Losers" sections
- [x] Stock cards with company icons
- [x] Price display in Indian Rupees (₹1,650)
- [x] Percentage changes with colored backgrounds
- [x] Green/red color coding for gains/losses
- [x] Green bottom navigation bar
- [x] Proper spacing and typography
- [x] Card shadows and styling
- [x] Grid layout for stock cards

### 🎨 Visual Features
- **Color Scheme**: Green primary (#10B981), matching the image
- **Typography**: Clean, modern fonts with proper weights
- **Icons**: MaterialIcons for consistency across platforms
- **Layout**: Responsive grid layout for stock cards
- **Shadows**: Subtle card shadows for depth
- **Status Indicators**: Green/red badges for stock performance

## 🚀 Ready for API Integration

The app is structured with placeholder data that exactly matches your image. The API service is ready for AlphaVantage integration:

### API Functions Ready:
- `getTopGainersLosers()` - For home screen data
- `getCompanyOverview()` - For detailed stock info
- `getQuote()` - For real-time prices
- `getDailyData()` - For charts
- `searchStocks()` - For search functionality

### Next Steps:
1. Add your AlphaVantage API key to `services/api.ts`
2. Replace mock data with API calls
3. Implement real-time updates
4. Add product detail screens
5. Implement chart functionality

## 🏃‍♂️ Running the App

```bash
# Navigate to project
cd my-app

# Install dependencies (if needed)
npm install

# Start development server
npm start

# Run on specific platforms
npm run ios     # iOS simulator
npm run android # Android emulator  
npm run web     # Web browser
```

## 📱 Supported Platforms
- ✅ iOS
- ✅ Android  
- ✅ Web

## 🔧 Key Technologies
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **AsyncStorage** for local storage
- **MaterialIcons** for icons
- **Axios** for API calls

The app is now ready with the exact UI from your image and a complete foundation for building out the full stock tracking platform! 🎉
