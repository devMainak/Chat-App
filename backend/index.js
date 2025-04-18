require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const initializeDatabase = require("./config/db.connection");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
