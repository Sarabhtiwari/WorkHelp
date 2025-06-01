const mongoose = require("mongoose");

const WorkerProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    age: { type: Number, required: true, min: 0 },
    skills: [{ type: String, trim: true }],
    experience: { type: Number, required: true, min: 0 },
    mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
    fees: { type: mongoose.Schema.Types.Mixed, required: true }, // *****Can be number or "as_per_work"
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkerProfile", WorkerProfileSchema);
