const express = require("express");
const cors = require("cors");

const matchesRoutes = require("./routes/matches.routes");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/matches", matchesRoutes);

// Home
app.get("/", (req, res) => {
  res.json({
    message: "DNA Matches Backend is running!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});