const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./Middleware/connectToDatabase");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*", 
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.get("/health", (req, res) => res.status(200).send("ok"));
app.head("/health", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => {
  res.json("Welcome to TripUp Backend Development! 🚀");
});


// ✅ Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT} ⛳`);
});