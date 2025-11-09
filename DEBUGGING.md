# Debugging Guide - Report Parsing Issues

## 🔍 How to Debug Upload Issues

I've added comprehensive logging throughout the application. Here's how to use it:

### Step 1: Open Browser Console
1. Open the application: http://localhost:3000/dashboard
2. Press `F12` or `Right Click > Inspect`
3. Go to the **Console** tab

### Step 2: Upload a File
1. Try uploading an image file (PNG, JPG, JPEG) or PDF
2. Watch the console for these messages:

#### Client-Side Logs (Browser Console):
```
📁 Starting file upload: [filename] [type] [size]
🚀 Sending request to /api/parse-report...
📥 Response status: 200 OK
✅ Parsed data received: {trades: [...], meta: {...}}
📊 Number of trades: 3
🧠 Generating insights for 3 trades...
📥 Insights response status: 200
✅ Insights generated: {bullets: [...], conclusion: "..."}
🎉 Upload complete! Trades loaded into state.
🏁 Upload process finished. Loading state: false
```

#### Server-Side Logs (Terminal):
```
🔵 API: parse-report endpoint called
📁 API: File received: [filename] [type] [size]
✅ API: File type valid
✅ API: File size valid
🤖 API: Attempting OpenAI Vision parsing...
⚠️ API: OpenAI Vision failed, using mock parser: [error]
✅ API: Mock parsing completed
📊 API: Returning 3 trades
```

### Step 3: Check for Errors

#### Common Issues:

**1. File Not Uploading**
- ❌ Error: "No file provided"
- **Fix**: Make sure you're selecting a file, not just clicking the area

**2. Invalid File Type**
- ❌ Error: "Invalid file type"
- **Fix**: Only use PNG, JPG, JPEG, or PDF files

**3. File Too Large**
- ❌ Error: "File too large"
- **Fix**: Use files under 10MB

**4. No Data Showing After Upload**
- Check browser console for:
  - `✅ Parsed data received:` - Is the data there?
  - `📊 Number of trades:` - How many trades?
  - If trades > 0 but not showing, check React state

**5. OpenAI API Issues**
- ⚠️ This is normal if you haven't set up an API key
- The app automatically falls back to mock data (3 sample trades)
- To use real OCR, add your OpenAI API key to `.env.local`

### Step 4: Test with Demo Data
1. Click "Load Demo Data" button
2. Should immediately show:
   - ✅ 15 trades
   - Summary cards with metrics
   - Charts (equity curve, P&L by symbol, etc.)
   - Trades table
   - AI insights panel

### Step 5: Verify Data Flow

Check each component is receiving data:

```javascript
// In browser console, type:
// (This shows you the current state)
```

## 🛠️ Manual Testing Steps

1. **Test Demo Data First**
   - Click "Load Demo Data"
   - Should see: 15 trades, charts, insights
   - ✅ If this works, the UI is fine

2. **Test File Upload**
   - Upload a PNG/JPG screenshot
   - Watch console logs
   - Should see: 3 mock trades after ~2 seconds
   - ✅ If this works, the upload mechanism is fine

3. **Test Filtering**
   - After loading data, try sidebar filters
   - Date range, symbols, side (BUY/SELL)
   - Numbers should update in summary cards

4. **Test Export**
   - Click CSV or JSON export buttons
   - Should download filtered data

## 🐛 Known Issues & Solutions

### Issue: "Upload successful but no data showing"
**Symptoms**: Toast says success, but dashboard stays on upload screen

**Debug Steps**:
1. Check browser console: `📊 Number of trades: ?`
2. If number is 0 or undefined, check API response
3. Make sure `data.trades` is an array

**Solution**:
```typescript
// The API should return:
{
  "trades": [...],
  "meta": {
    "currency": "INR",
    "source": "ocr",
    "rowsParsed": 3,
    "parseConfidence": 0.87
  }
}
```

### Issue: "Charts not showing"
**Cause**: ChartsSection was commented out

**Solution**: ✅ Already fixed! Charts are now enabled.

### Issue: "Infinite loading spinner"
**Cause**: `isLoading` state not resetting

**Debug**:
1. Check for `🏁 Upload process finished` in console
2. Should say `Loading state: false`

**Solution**: Error in try/catch - check the error message

## 📊 Expected Data Format

### Trades Array:
```typescript
[
  {
    date: "2025-01-08",      // ISO date string
    symbol: "RELIANCE",      // Stock symbol
    side: "BUY",            // "BUY" or "SELL"
    quantity: 50,           // Number
    price: 2850.25,         // Number
    pnl: 1250.00           // Number (optional)
  }
]
```

### Insights Response:
```typescript
{
  bullets: [
    "Insight 1",
    "Insight 2",
    // ...
  ],
  conclusion: "Overall summary...",
  stats: {
    totalTrades: 15,
    wins: 10,
    losses: 5,
    winRate: 0.67,
    grossPnl: 12500,
    avgWin: 2500,
    avgLoss: -1200,
    bestTrade: { symbol: "INFY", pnl: 4000, date: "2025-01-10" },
    worstTrade: { symbol: "LT", pnl: -1500, date: "2025-01-05" }
  }
}
```

## 🔧 Quick Fixes

### Clear Everything and Start Fresh:
```bash
# Kill all processes
pkill -9 -f "next dev"
fuser -k 3000/tcp

# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

### Reset Browser State:
1. Open DevTools > Application > Local Storage
2. Clear `tradeSight_recentUploads`
3. Refresh page

## 📞 Still Having Issues?

If you see any errors in the console that aren't explained above, please share:
1. The exact error message
2. When it occurs (during upload, after success, etc.)
3. Browser console screenshot
4. Terminal output

The detailed logging will help us identify exactly where the issue is!