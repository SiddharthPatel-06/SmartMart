import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* —— leaflet‑vite icon fix —— */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* coloured markers */
const markerFactory = (colour) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colour}.png`,
    iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colour}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const martIcon = markerFactory("red");
const status2icon = {
  pending: markerFactory("yellow"),
  dispatched: markerFactory("blue"),
  delivered: markerFactory("green"),
  cancelled: markerFactory("violet"),
};

export default function MapView({
  martCoords = [],
  markers = [],
  onMarkerClick = () => {},
}) {
  if (martCoords.length !== 2) return null;
  const [lng, lat] = martCoords;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Mart */}
      <Marker position={[lat, lng]} icon={martIcon}>
        <Popup>Mart (origin)</Popup>
        <Tooltip direction="top" offset={[0, -28]} permanent>
          🏬 Mart
        </Tooltip>
      </Marker>

      {/* Customers */}
      {markers.map((m) =>
        m.coords.length === 2 ? (
          <Marker
            key={m.id}
            position={[m.coords[1], m.coords[0]]}
            icon={status2icon[m.status] ?? status2icon.pending}
            eventHandlers={{ click: () => onMarkerClick(m) }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-bold">
                  #{m.seq}. Order {m.id.slice(-6)}
                </div>
                <div>📞 {m.phone}</div>
                <div>📍 {m.distance} away</div>
                <div>📦 {m.status}</div>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -28]} permanent>
              {m.seq}
            </Tooltip>
          </Marker>
        ) : null
      )}

      {/* polyline Mart ➜ stop 1 ➜ … */}
      {markers.length > 0 && (
        <Polyline
          positions={[
            [lat, lng],
            ...markers.map((m) => [m.coords[1], m.coords[0]]),
          ]}
          color="dodgerblue"
          dashArray="5,5"
        />
      )}
    </MapContainer>
  );
}
