# EVOK Lead Tracker - Backend API

Node.js/Express backend for the EVOK Lead Tracker application.

## Features
- RESTful API for lead management
- MongoDB database with Mongoose ODM
- Activity log tracking
- Dashboard statistics endpoint
- CORS enabled for frontend integration

## Installation

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/evok-leads
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/:id/log` - Add activity log

### Statistics
- `GET /api/stats` - Get dashboard statistics

### Health Check
- `GET /api/health` - Server health status

## MongoDB Setup

### Local Development
Install MongoDB locally or use MongoDB Atlas (cloud).

For local MongoDB:
```bash
# The server will connect to: mongodb://localhost:27017/evok-leads
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Testing the API

Use tools like Postman, Thunder Client, or curl:

```bash
# Get all leads
curl http://localhost:5000/api/leads

# Create a lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"business":"Test Company","contact":"1234567890","location":"Kochi","district":"Ernakulam"}'
```

## Deployment

See deployment guide in the main README for deploying to Render.com.
