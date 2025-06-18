# Tourist Tax Application

This project provides a small Next.js interface for converting CSV exports from your booking system into an XLS summary for local tourist tax declarations.

## Setup

Install dependencies with:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Production Build

Compile the project for production:

```bash
npm run build
```

The optimized application can then be served with `npm start`.

## CSV Input

The tool expects a UTF-8 CSV file with one row per booking. Each row should include at least the arrival date, departure date, number of guests and nightly rate. Extra columns are ignored.

## Generated XLS Output

After processing, the application produces an XLS workbook summarizing stays by month. This file can be uploaded directly to your local administration portal.
