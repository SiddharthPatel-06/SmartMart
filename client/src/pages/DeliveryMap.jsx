import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOptimizedBatch } from "../app/slices/deliverySlice";
import { fetchMartByOwner } from "../app/slices/martSlice";
import MapView from "../components/MapView";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";

const DeliveryMap = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { mart, status: martStatus } = useSelector((s) => s.mart);
  const { martCoords, markers, loading, error } = useSelector(
    (s) => s.delivery
  );

  /* load mart once */
  useEffect(() => {
    if (!user?.id) return;
    if (!mart && martStatus === "idle") {
      dispatch(fetchMartByOwner(user.id))
        .unwrap()
        .catch((err) => toast.error(err));
    }
  }, [user?.id, mart, martStatus, dispatch]);

  /* load route batch when mart changes */
  useEffect(() => {
    if (mart?._id) dispatch(getOptimizedBatch(mart._id));
  }, [mart?._id, dispatch]);

  const refresh = () => mart?._id && dispatch(getOptimizedBatch(mart._id));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Delivery Routes</h1>

      {loading && <p>Loading routes…</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && markers.length === 0 && (
        <p>No pending deliveries.</p>
      )}

      {/* 🗺️ Map */}
      <MapView martCoords={martCoords} markers={markers} />

      <Button className="mt-2" onClick={refresh} disabled={loading}>
        Refresh
      </Button>
    </div>
  );
};

export default DeliveryMap;
