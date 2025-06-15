const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const cookieParser = require("cookie-parser")

const workerRoutes = require("./routes/workerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

dotenv.config();

const app = express();

connectDB();
app.set("trust proxy", 1);
app.use(
    cors({
      origin: process.env.FRONTEND_URL, 
      credentials: true, 
    })
  );
app.use(express.json()); 
app.use(cookieParser());

app.use("/api/worker", workerRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/user",userRoutes);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT,()=>{
 console.log(`server listening on port ${PORT}`)
});