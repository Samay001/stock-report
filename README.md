# TradeSight - Stock Trading Dashboard

A modern, AI-powered stock trading analysis dashboard built with Next.js 14. Upload your trading reports and get instant insights with beautiful visualizations.

![TradeSight Dashboard](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=TradeSight+Dashboard)

## ✨ Features

- **📊 Smart OCR Parsing**: Upload screenshots or PDFs of trading reports
- **🤖 AI-Powered Insights**: Get trading analysis and recommendations from GPT-4
- **📈 Interactive Charts**: Equity curves, P&L by symbol, and performance metrics
- **🔍 Advanced Filtering**: Filter trades by date, symbol, side, and P&L range
- **📱 Responsive Design**: Mobile-first design with dark/light mode support
- **💾 Local Storage**: Recent uploads tracking for quick access
- **📤 Export Options**: Download data as CSV or JSON

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Charts**: Recharts for data visualization
- **AI Integration**: OpenAI GPT-4 Vision and Text APIs
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with CSS variables for theming

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional - app works with demo data)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock-report
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started

1. **Landing Page**: Visit the homepage to learn about features
2. **Dashboard**: Click "Start Analyzing" to access the main dashboard
3. **Try Demo**: Use "Load Demo Data" to explore with sample data

### Uploading Reports

1. **Drag & Drop**: Simply drag your trading report image/PDF to the upload area
2. **File Picker**: Click to browse and select files manually
3. **Supported Formats**: PNG, JPG, JPEG, PDF (max 10MB)

### Using the Dashboard

- **Summary Cards**: View key metrics (total trades, win rate, P&L, etc.)
- **Filters**: Use the sidebar to filter trades by various criteria
- **Charts**: Analyze performance with interactive visualizations
- **Data Table**: Sort, search, and export your trading data
- **AI Insights**: Get personalized analysis and recommendations

### Features in Detail

#### 📊 Summary Cards
- Total Trades count
- Win Rate percentage
- Gross P&L with color coding
- Average Win/Loss amounts
- Real-time filtering updates

#### 📈 Charts Section
- **Equity Curve**: Cumulative P&L over time
- **P&L by Symbol**: Bar chart showing performance per stock
- **Side Distribution**: Pie chart of buy vs sell trades

#### 🔍 Advanced Filtering
- **Date Range**: Filter trades by specific time periods
- **Symbols**: Multi-select symbol filtering
- **Trade Side**: Filter by BUY/SELL/ALL
- **P&L Range**: Set minimum and maximum P&L thresholds

#### 📤 Export Options
- **CSV Export**: Download filtered data as spreadsheet
- **JSON Export**: Export for integration with other tools
- **Filename Timestamps**: Auto-generated filenames with dates

## 🤖 AI Integration

### OpenAI Vision (OCR)
- Extracts trade data from uploaded images/PDFs
- Identifies columns: Date, Symbol, Side, Quantity, Price, P&L
- Returns structured JSON with confidence scores

### GPT-4 Text Analysis
- Generates bullet-point insights from trade data
- Calculates performance statistics
- Provides actionable recommendations
- Creates executive summary conclusions

### Fallback Mode
When OpenAI API is unavailable:
- Mock OCR returns sample parsed data
- Local calculations provide basic insights
- All features remain functional

## 🎨 Design System

### Components
- Built with shadcn/ui for consistency
- Accessible, keyboard-navigable components
- Comprehensive TypeScript types

### Theming
- Light/Dark mode with system preference detection
- CSS variables for easy customization
- Responsive breakpoints for mobile-first design

### Colors
- Success: Green tones for profits/wins
- Danger: Red tones for losses/negative
- Muted: Neutral grays for secondary information
- Primary: Brand color for CTAs and highlights

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── insights/      # AI insights generation
│   │   └── parse-report/  # OCR parsing endpoint
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── charts-section.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   ├── insights-panel.tsx
│   │   ├── summary-cards.tsx
│   │   ├── trades-table.tsx
│   │   └── upload-area.tsx
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/                  # Utilities and configurations
│   ├── demo-data.ts     # Sample trading data
│   ├── localStorage.ts  # Browser storage utilities
│   ├── trade-utils.ts   # Trading calculations
│   ├── types.ts         # TypeScript definitions
│   └── utils.ts         # General utilities
└── public/              # Static assets
```

## 🔧 API Endpoints

### POST `/api/parse-report`
Processes uploaded trading reports using OCR.

**Request**: `multipart/form-data` with file
**Response**: `ParseReportResponse` with trades array

### POST `/api/insights`
Generates AI insights from trading data.

**Request**: JSON with trades array
**Response**: `InsightsResponse` with insights and stats

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy automatically

### Other Platforms
- Ensure Node.js 18+ support
- Set environment variables
- Build with `npm run build`
- Start with `npm start`

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Optional* |

*App works with demo data when API key is not provided.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide](https://lucide.dev/) for consistent icons
- [Recharts](https://recharts.org/) for chart visualizations
- [OpenAI](https://openai.com/) for AI capabilities

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-username/stock-report/issues)
- Documentation: This README and inline code comments

---

Built with ❤️ using Next.js and modern web technologies.
