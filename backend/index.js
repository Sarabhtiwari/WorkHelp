const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');const cookieParser = require("cookie-parser")

dotenv.config();

const app = express();

connectDB();

app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true, 
    })
  );
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`server listening on port ${PORT}`)
});