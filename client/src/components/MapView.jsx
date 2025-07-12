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
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* 🎨  custom colours */
const martIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const customerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ martCoords = [], markers = [] }) {
  if (martCoords.length !== 2) return null;

  const [lng, lat] = martCoords;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "70vh", width: "100%" }}
    >
      {/* 🎨 Voyager tiles – bright & modern */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* 🏬 Mart */}
      <Marker position={[lat, lng]} icon={martIcon}>
        <Popup>SmartMart (origin)</Popup>
        <Tooltip direction="top" offset={[0, -28]} permanent>
          🏬 Mart
        </Tooltip>
      </Marker>

      {/* 📦 Customers */}
      {markers.map((m) =>
        m.coords.length === 2 ? (
          <Marker
            key={m.id}
            position={[m.coords[1], m.coords[0]]}
            icon={customerIcon}
          >
            <Popup>
              📞 {m.phone}
              <br />
              📍 {m.distance}
              <br />
              📦 {m.status}
            </Popup>
            <Tooltip direction="top" offset={[0, -28]} permanent>
              {m.distance}
            </Tooltip>
          </Marker>
        ) : null
      )}

      {/* 🛣️ Polyline path */}
      {markers.length > 0 && (
        <Polyline
          positions={[
            [lat, lng],
            ...markers.map((m) => [m.coords[1], m.coords[0]]),
          ]}
          color="dodgerblue"
        />
      )}
    </MapContainer>
  );
}
