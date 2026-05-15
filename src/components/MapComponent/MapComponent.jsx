import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

export default function MapComponent({ agents, listings, center, zoom }) {
  const centerPosition = center || [37.0662, 37.3833];

  return (
    <MapContainer
      center={centerPosition}
      zoom={zoom || 12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ResizeHandler />

      {agents?.map(
        (agent) =>
          agent.lat &&
          agent.lng && (
            <Marker key={agent.id} position={[agent.lat, agent.lng]}>
              <Popup>
                <strong>{agent.title || agent.name}</strong>
                <br />
                <a href={`tel:${agent.phone}`}>{agent.phone}</a>
              </Popup>
            </Marker>
          ),
      )}

      {listings?.map(
        (listing) =>
          listing.lat &&
          listing.lng && (
            <Marker key={listing.id} position={[listing.lat, listing.lng]}>
              <Popup>
                <strong>{listing.title}</strong>
                <br />
                {listing.price?.toLocaleString()} ₺<br />
                {listing.neighborhood} / {listing.type}
              </Popup>
            </Marker>
          ),
      )}
    </MapContainer>
  );
}
