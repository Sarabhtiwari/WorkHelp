const BASE_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";

const FindWorkers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [filters, setFilters] = useState({
    skills: "",
    city: "",
    state: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch location from localStorage
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      const location = JSON.parse(storedLocation);
      setFilters((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      fetchJobs(location);
    } else {
      toast.error("Unable to fetch location. Some features may be limited.");
      fetchJobs({});
    }
  }, []);

  const fetchJobs = async (locationParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.skills) params.append("skills", filters.skills);
      if (filters.city) params.append("city", filters.city);
      if (filters.state) params.append("state", filters.state);
      if (filters.pincode) params.append("pincode", filters.pincode);
      if (nextCursor) params.append("cursor", nextCursor);

      if (locationParams.latitude) {
        params.append("latitude", locationParams.latitude);
      }
      if (locationParams.longitude) {
        params.append("longitude", locationParams.longitude);
      }

      const response = await axios.get(
        `${BASE_URL}/api/user/find-workers?${params.toString()}`,
        { withCredentials: true }
      );

      setJobs(response.data.jobs);
      setNextCursor(response.data.nextCursor);
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Failed to fetch jobs";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setNextCursor(null);
    fetchJobs({});
  };

  const loadMoreJobs = () => {
    if (nextCursor) {
      fetchJobs({});
    }
  };

  return (
    <div className="p-8 bg-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">Available Jobs</h1>
        <Logout />
      </div>

      {/* Search/Filter Form */}
      <div className="mb-6 bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSearchSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Filter */}
            <div>
              <label className="block text-lg text-gray-700 font-semibold mb-2">
                Skill
              </label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="E.g. React"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* City Filter */}
            <div>
              <label className="block text-lg text-gray-700 font-semibold mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="E.g. New York"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* State Filter */}
            <div>
              <label className="block text-lg text-gray-700 font-semibold mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                placeholder="E.g. NY"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* Pincode Filter */}
            <div>
              <label className="block text-lg text-gray-700 font-semibold mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={filters.pincode}
                onChange={handleFilterChange}
                placeholder="E.g. 10001"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters({
                  skills: "",
                  city: "",
                  state: "",
                  pincode: "",
                  latitude: filters.latitude,
                  longitude: filters.longitude,
                });
                setNextCursor(null);
                fetchJobs({});
              }}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-xl text-gray-500">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-lg">No jobs found matching your criteria</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-6 bg-white shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-green-600">{job.title}</h2>
              <p className="text-gray-700 mt-2 mb-4">{job.description}</p>

              {job.skills && job.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-700">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-lg text-gray-700">
                  {job.budget
                    ? `Budget: $${job.budget}`
                    : "Budget: Not specified"}
                </span>
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700"
                  onClick={() => navigate(`/worker-details/${job._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}

          {nextCursor && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreJobs}
                className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindWorkers;
