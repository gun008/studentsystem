# Student Management App

Simple React (Vite) app for managing students, with MongoDB persistence through the Express API.

Run:

```bash
npm install
cp .env.example .env
npm run server

# In a second terminal
npm run dev
```

Set `MONGODB_URI` in `.env` to your MongoDB Atlas connection string. In Atlas, add the machine's IP address under Network Access and create a database user under Database Access. The API runs on port 3001 and Vite proxies `/api` requests during development.
