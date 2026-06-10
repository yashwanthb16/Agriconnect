const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes=require("./routes/authRoutes");
dotenv.config();

// Connect Database
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AgriConnect Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth",authRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});