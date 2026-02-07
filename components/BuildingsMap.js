import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import '../lib/leafletFix'

export default function BuildingsMap({ buildings }) {
  const valid = buildings.filter(
    b => b.latitude && b.longitude
  )

  if (valid.length === 0) {
    return <p>No buildings with coordinates yet.</p>
  }

  const center = [
    valid[0].latitude,
    valid[0].longitude
  ]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {valid.map(b => (
        <Marker
          key={b.id}
          position={[b.latitude, b.longitude]}
        >
          <Popup>
            <strong>{b.name}</strong><br />
            {b.classification}<br />
            Occupants: {b.occupants || 'N/A'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
