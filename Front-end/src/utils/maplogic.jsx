// MapWithDijkstra.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dummy graph node data with coordinates
const pickupPoints = [
  { id: 'A', name: 'Point A', lat: 27.700, lng: 85.300 },
  { id: 'B', name: 'Point B', lat: 27.705, lng: 85.310 },
  { id: 'C', name: 'Point C', lat: 27.710, lng: 85.315 },
  { id: 'D', name: 'Point D', lat: 27.707, lng: 85.295 },
];

// Manually defined graph adjacency list with weights (distances in km)
const graph = {
  A: [{ to: 'B', weight: 1.5 }, { to: 'D', weight: 2.1 }],
  B: [{ to: 'A', weight: 1.5 }, { to: 'C', weight: 1.2 }],
  C: [{ to: 'B', weight: 1.2 }, { to: 'D', weight: 2.7 }],
  D: [{ to: 'A', weight: 2.1 }, { to: 'C', weight: 2.7 }],
};

// Find shortest path using Dijkstra's algorithm
function dijkstra(start, end, graph) {
  const distances = {};
  const prev = {};
  const pq = new Set(Object.keys(graph));

  Object.keys(graph).forEach(v => (distances[v] = Infinity));
  distances[start] = 0;

  while (pq.size > 0) {
    const current = [...pq].reduce((min, node) => (distances[node] < distances[min] ? node : min));
    pq.delete(current);

    if (current === end) break;

    graph[current].forEach(neighbor => {
      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.to]) {
        distances[neighbor.to] = alt;
        prev[neighbor.to] = current;
      }
    });
  }

  // Reconstruct path
  const path = [];
  let u = end;
  while (prev[u]) {
    path.unshift(u);
    u = prev[u];
  }
  if (u === start) path.unshift(start);
  return path;
}

// Find node closest to given lat/lng
function getNearestNode(lat, lng) {
  let minDist = Infinity;
  let closest = null;

  pickupPoints.forEach(point => {
    const d = Math.sqrt((point.lat - lat) ** 2 + (point.lng - lng) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = point;
    }
  });

  return closest;
}

export default function MapWithDijkstra({ userLocation }) {
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (userLocation) {
      const nearest = getNearestNode(userLocation.lat, userLocation.lng);
      const pathNodes = dijkstra('A', nearest.id, graph); // assume user starts from 'A' for demo

      const latLngPath = pathNodes.map(id => {
        const point = pickupPoints.find(p => p.id === id);
        return [point.lat, point.lng];
      });
      setPath(latLngPath);
    }
  }, [userLocation]);

  return (
    <MapContainer
      center={[27.705, 85.310]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

      {pickupPoints.map((point) => (
        <Marker key={point.id} position={[point.lat, point.lng]}>
          <Popup>{point.name}</Popup>
        </Marker>
      ))}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [25, 25],
          })}
        >
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {path.length > 1 && (
        <Polyline positions={path} color='blue' />
      )}
    </MapContainer>
  );
}
