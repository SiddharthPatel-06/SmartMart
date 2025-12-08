import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Button from "../components/ui/Button";

const AdminReorderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://smartmart-qno0.onrender.com";

const fetchRequests = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${API_BASE_URL}/api/reorders`, {
      params: filter ? { status: filter } : {},
    });
    setRequests(Array.isArray(res.data) ? res.data : res.data.requests || []);
  } catch (err) {
    console.error("Failed to fetch reorder requests", err);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/reorders/${id}`, { status });
      fetchRequests();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/reorders/${id}`);
      fetchRequests();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const statusColors = {
    pending: "bg-yellow-500",
    processed: "bg-green-600",
    failed: "bg-red-600",
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reorder Requests</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 text-white p-2 rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">No reorder requests found.</p>
      ) : (
        <table className="w-full bg-neutral-900 rounded-xl overflow-hidden">
          <thead className="bg-neutral-800">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Requested Qty</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t border-neutral-800">
                <td className="p-3">{req.productId?.name || "N/A"}</td>
                <td className="p-3">{req.productId?.category || "-"}</td>
                <td className="p-3">{req.quantity}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded text-sm ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <Button onClick={() => updateStatus(req._id, "processed")}
                    className="bg-green-600 hover:bg-green-700">
                    <FiCheckCircle />
                  </Button>
                  <Button onClick={() => updateStatus(req._id, "failed")}
                    className="bg-yellow-600 hover:bg-yellow-700">
                    <FiXCircle />
                  </Button>
                  <Button onClick={() => deleteRequest(req._id)}
                    className="bg-red-600 hover:bg-red-700">
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReorderRequests;
