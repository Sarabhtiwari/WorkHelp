import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [Auth, setAuth] = useState({
    email: "",
    password: "",
    role: "user",
    otp: "",
  });

  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email: Auth.email,
          password: Auth.password,
          role: Auth.role,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "An error occurred."
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        {
          email: Auth.email,
          otp: Auth.otp,
        },
        { withCredentials: true }
      );

      alert("OTP Verified Successfully! You are now registered.");
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.message
          : "OTP verification failed."
      );
    }
  };

  return (
    // Inside the return statement
<div className="min-h-screen flex items-center justify-center bg-[#fefefc] font-sans text-gray-800">
  <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200">
    <h2 className="text-2xl font-bold text-emerald-700 text-center mb-6">Create Account</h2>

    <form className="space-y-4" onSubmit={handleVerifyOtp}>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={Auth.email}
          onChange={(e) => setAuth({ ...Auth, email: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={Auth.password}
          onChange={(e) => setAuth({ ...Auth, password: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          value={Auth.role}
          onChange={(e) => setAuth({ ...Auth, role: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        >
          <option value="user">User</option>
          <option value="worker">Worker</option>
        </select>
      </div>

      {/* OTP field */}
      {otpSent && (
        <div>
          <label className="block text-sm font-medium mb-1">Enter OTP</label>
          <input
            type="text"
            value={Auth.otp}
            onChange={(e) => setAuth({ ...Auth, otp: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>
      )}

      {/* Buttons */}
      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOtp}
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
        >
          Send OTP
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
        >
          Verify OTP
        </button>
      )}
    </form>
    {message && <p className="mt-4 text-center text-red-500">{message}</p>}
  </div>
</div>

  );
};

export default Register;
