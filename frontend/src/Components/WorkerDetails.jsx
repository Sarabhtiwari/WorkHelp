import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-toastify";

const WorkerDetails = () => {
  const { id } = useParams(); 
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/worker/details/${id}`, {
          withCredentials: true
        });
        setWorker(response.data); 
      } catch (error) {
        const errorMessage = (error.response && error.response.data && error.response.data.message) || "Failed to fetch worker details";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerDetails();
  }, [id]); // Fetch when the worker ID changes

  if (loading) {
    return <div className="text-center text-lg text-green-600">Loading worker details...</div>;
  }

  if (!worker) {
    return <div className="text-center text-lg text-red-600">No worker found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Worker Details</h1>

      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Name:</div>
          <div className="text-gray-600">{worker.name}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Skills:</div>
          <div className="text-gray-600">{worker.skills.join(", ")}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Experience:</div>
          <div className="text-gray-600">{worker.experience} years</div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Contact:</div>
          <div className="text-gray-600">{worker.mobile}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Age:</div>
          <div className="text-gray-600">{worker.age}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Fees:</div>
          <div className="text-gray-600">${worker.fees}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-700">Gender:</div>
          <div className="text-gray-600">{worker.gender}</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
        >
          Back to Jobs
        </button>
      </div>
    </div>
  );
};

export default WorkerDetails;
