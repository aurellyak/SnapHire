# SnapHire Backend API

Express.js backend for SnapHire application.

## Setup

### Install dependencies
```bash
npm install
```

### Environment variables
Copy `.env` file with required configurations (already included).

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Documentation

- Base URL: `http://localhost:8000`
- API Version: `/api/v1`

### Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - PostgreSQL database
- **Azure Storage** - Blob storage for CVs
- **CORS** - Cross-origin resource sharing
