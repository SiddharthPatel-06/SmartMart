import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOptimizedBatch,
  updateOrderStatus,
} from "../app/slices/deliverySlice";
import { fetchMartByOwner } from "../app/slices/martSlice";
import MapView from "../components/MapView";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";

const STATUS = ["pending", "dispatched", "delivered", "cancelled"];

export default function DeliveryMap() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { mart, status: martStatus } = useSelector((s) => s.mart);
  const { martCoords, markers, loading, error } = useSelector(
    (s) => s.delivery
  );

  useEffect(() => {
    if (!user?.id) return;
    if (!mart && martStatus === "idle") {
      dispatch(fetchMartByOwner(user.id))
        .unwrap()
        .catch((err) => toast.error(err));
    }
  }, [user?.id, mart, martStatus, dispatch]);

  useEffect(() => {
    if (mart?._id) dispatch(getOptimizedBatch(mart._id));
  }, [mart?._id, dispatch]);

  const refresh = () => mart?._id && dispatch(getOptimizedBatch(mart._id));

  const changeStatus = (id, status) =>
    dispatch(updateOrderStatus({ orderId: id, status }))
      .unwrap()
      .then(() => toast.success("Status updated"))
      .catch((e) => toast.error(e));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Delivery Routes</h1>

      {loading && <p>Loading routes…</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && markers.length === 0 && (
        <p>No pending deliveries.</p>
      )}

      <MapView martCoords={martCoords} markers={markers} />

      {/* order list */}
      {markers.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between bg-neutral-800/50
                     border border-neutral-700 rounded px-4 py-2 mt-2"
        >
          <div>
            <p className="font-medium">
              #{m.seq}. {m.phone} — {m.distance}
            </p>
            <p className="text-sm text-neutral-400">Status: {m.status}</p>
          </div>

          <select
            value={m.status}
            onChange={(e) => changeStatus(m.id, e.target.value)}
            className="bg-neutral-700 text-white rounded px-2 py-1 text-sm"
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ))}

      <Button
        onClick={refresh}
        disabled={loading}
        className="flex items-center gap-2 mt-2"
      >
        <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
      </Button>
    </div>
  );
}
