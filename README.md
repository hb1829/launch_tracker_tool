# Launch Tracker Tool

A modern web application for tracking product launches across different regions on an interactive timeline.

## Features

- **Multi-Region Support**: View product launches for US, EU, China, and Japan
- **Year-Based Timeline**: Launches organized chronologically by year
- **Interactive UI**: Smooth animations and responsive design
- **Real-time Data Fetching**: Backend API for retrieving region-specific data
- **Category Organization**: Products organized by category (Analytics, Cloud Services, etc.)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Next.js API Routes
- **Styling**: CSS Modules
- **Package Manager**: npm

## Project Structure

```
launch_tracker_tool/
├── components/              # React components
│   ├── RegionSelector.tsx   # Region selection buttons
│   └── Timeline.tsx         # Main timeline component
├── data/
│   └── launches.ts          # Product launch data
├── pages/
│   ├── api/
│   │   └── launches.ts      # API endpoint for launches
│   ├── _app.tsx             # Next.js app wrapper
│   ├── _document.tsx        # HTML document wrapper
│   └── index.tsx            # Main page
├── styles/
│   ├── globals.css          # Global styles
│   ├── index.module.css     # Index page styles
│   ├── RegionSelector.module.css
│   └── Timeline.module.css
├── package.json
├── tsconfig.json
└── next.config.js
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## API Routes

### GET /api/launches

Fetch product launches for a specific region.

**Query Parameters:**
- `region` (required): One of `US`, `EU`, `CN`, `JP`

**Example:**
```bash
curl "http://localhost:3000/api/launches?region=US"
```

**Response:**
```json
{
  "launches": [
    {
      "id": "us-1",
      "productName": "Analytics Pro",
      "year": 2022,
      "month": 3,
      "region": "US",
      "category": "Analytics",
      "description": "Advanced analytics dashboard for enterprise users"
    }
  ]
}
```

## Data Format

Each product launch contains:
- `id`: Unique identifier
- `productName`: Name of the product
- `year`: Launch year (2022-2025)
- `month`: Launch month (1-12)
- `region`: Target region (US, EU, CN, JP)
- `category`: Product category
- `description`: Brief product description

## Customization

### Adding New Product Launches

Edit [data/launches.ts](data/launches.ts) and add new entries to the `productLaunches` array:

```typescript
{
  id: "us-5",
  productName: "Your Product",
  year: 2025,
  month: 6,
  region: "US",
  category: "Your Category",
  description: "Product description"
}
```

### Styling

All components use CSS Modules for scoped styling. Modify the files in the `styles/` directory:
- Colors are defined using gradients (purple/blue theme)
- Responsive design breakpoints at 768px and 1024px
- Smooth transitions and hover effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Advanced filtering and search
- [ ] Data export (CSV/PDF)
- [ ] Custom date range selection
- [ ] Interactive charts and statistics
- [ ] User authentication and favorites
- [ ] Dark mode support

## License
