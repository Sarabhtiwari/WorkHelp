const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Store hashed password
    otp: { type: String, required: function () { return !this.isVerified; } }, 
    otpExpiresAt: { type: Date, required: function () { return !this.isVerified; } },
    isVerified: { type: Boolean, default: false },
    
    role: { type: String, enum: ["worker", "user"], default: "user" },
  },
  
  { timestamps: true }
);
AuthSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 600, partialFilterExpression: { isVerified: false } }
);

module.exports = mongoose.model("Auth", AuthSchema);
