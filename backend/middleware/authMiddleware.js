const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.authToken; 

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token Payload:", decoded);

    req.user = { authId: decoded.id }; 
    next();
  } catch (err) {
    // console.error("Token Verification Error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
