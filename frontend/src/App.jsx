import { useEffect } from "react";
import Register from "./Components/Register";
import LoginPage from "./Components/LoginPage";
import Home from "./Components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import FindWorkers from "./Components/FindWorkers";
import CompleteProfile from "./Components/CompleteProfile";

function App() {
  useEffect(() => {
    // Fetch user's location when they visit the site
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          localStorage.setItem("userLocation", JSON.stringify(location));
          console.log("Location stored:", location);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/find-workers" element={<FindWorkers />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/complete-profile-worker"
          element={
            <ProtectedRoute allowedRoles={["worker"]}>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
