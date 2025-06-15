const BASE_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkerLandingPage = () => {
  const navigate = useNavigate();
  const [jobPosted, setJobPosted] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateProfile = () => {
    navigate("/complete-profile-worker");
  };

  const onPostJob = async () => {
    console.log("onPostJob function triggered");
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/worker/post-job`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Job posted successfully:", response.data);
      toast.success("Job posted successfully!");
      setJobPosted(true);
    } catch (error) {
      if (error.response) {
        console.error("Error posting job (response):", error.response.data);
        toast.error("Job already posted!");
      } else {
        console.error("Error posting job:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onUnpostJob = async () => {
    console.log("onUnpostJob function triggered");
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/api/worker/unpost-job`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Job unposted successfully:", response.data);
      toast.success("Job unposted successfully!");

      setJobPosted(false);
    } catch (error) {
      if (error.response) {
        console.error("Error unposting job (response):", error.response.data);
        toast.error("No Job to unpost!");
      } else {
        console.error("Error unposting job:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 max-w-screen-md mx-auto rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-emerald-600">Worker Dashboard</h2>
        <Logout />
      </div>
      <div className="flex flex-col gap-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={updateProfile}
        >
          Update Profile
        </button>
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          onClick={onPostJob}
          disabled={jobPosted || loading}
        >
          {loading && !jobPosted ? "Posting..." : "Post Job"}
        </button>
        <button
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
          onClick={onUnpostJob}
        >
          Unpost Job
        </button>
        <button
        onClick={() => navigate("/find-workers")}
        className="w-full bg-green-500 text-white px-4 py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
      >
        Find Workers
      </button>
      </div>
    </div>
  );
};

export default WorkerLandingPage;
