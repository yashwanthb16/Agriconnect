const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const transportRoutes = require('./routes/transportRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected');

    const TransportDriver = require('./models/TransportDriver');
    await TransportDriver.syncIndexes();
    console.log('TransportDriver indexes synced');

    const app = express();

    const fs = require('fs');
    const path = require('path');

    // ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    app.use(express.json());
    app.use(cors());

    // serve uploaded files statically
    app.use("/uploads", express.static(uploadsDir));

    app.get("/", (req, res) => {
      res.send("AgriConnect Backend Running");
    });

    const PORT = process.env.PORT || 5000;
    app.use("/api/auth", authRoutes);
    app.use("/api/transport", transportRoutes);
    app.use("/api/booking", bookingRoutes);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();