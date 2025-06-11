const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Auth = require("../models/AuthDetails");


// Email Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    const userRole = role || "user";
    const auth = new Auth({
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      role: userRole,
    });
    await auth.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Your OTP for email verification is: <b>${otp}</b></p><p>It will expire in 10 minutes.</p>`,
    });
    // console.log("Saving user with:", {
    //   email,
    //   password: hashedPassword,
    //   otp,
    //   otpExpiresAt,
    //   role,
    // });

    res.status(201).json({
      message: "OTP sent! Please verify your email.",
      email: auth.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify email with OTP
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const auth = await Auth.findOne({ email });
    if (!auth) return res.status(404).json({ message: "User not found" });

    if (
      auth.otp.toString() !== otp.toString() ||
      auth.otpExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Auth.updateOne(
      { email },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpiresAt: "" },
      }
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const auth = await Auth.findOne({ email });
    if (!auth) return res.status(404).json({ message: "User not found" });

    if (!auth.isVerified) {
      return res.status(400).json({
        message:
          "Email not verified. Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: auth._id, role: auth.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict", 
      maxAge: 2 * 60 * 60 * 1000, 
    });
  
    res.cookie("role", auth.role, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000, 
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      role: auth.role,
      token, 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// //4.get  role

// exports.getRole = async (req, res) => {
//   try {
//     const user = await Auth.findById(req.user.authId);
//     res.json({ role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user role" });
//   }
// };



// Logout user
exports.logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};