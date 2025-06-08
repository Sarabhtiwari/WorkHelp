const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');const cookieParser = require("cookie-parser")

const workerRoutes = require("./routes/workerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true, 
    })
  );
app.use(express.json()); 
app.use(cookieParser());

app.use("/api/worker", workerRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/user",userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`server listening on port ${PORT}`)
});