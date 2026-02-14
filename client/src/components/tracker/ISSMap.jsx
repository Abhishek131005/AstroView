import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, Maximize2 } from 'lucide-react';
import { getISSPosition } from '@/services/satelliteService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom ISS marker icon
const issIcon = new L.DivIcon({
  className: 'custom-iss-marker',
  html: `
    <div style="position: relative;">
      <div style="
        width: 24px;
        height: 24px;
        background: #00D9FF;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(0, 217, 255, 0.8);
        animation: pulse 2s infinite;
      "></div>
      <div style="
        position: absolute;
        top: -8px;
        left: -8px;
        width: 40px;
        height: 40px;
        border: 2px solid #00D9FF;
        border-radius: 50%;
        opacity: 0.3;
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Component to auto-center map on ISS
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

function ISSMap() {
  const [issPosition, setIssPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchISSPosition = async () => {
    try {
      const data = await getISSPosition();
      const newPosition = {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude),
        altitude: parseFloat(data.altitude),
        velocity: parseFloat(data.velocity),
        timestamp: data.timestamp
      };

      setIssPosition(newPosition);
      setLastUpdate(new Date());
      
      // Add to trajectory (keep last 50 positions)
      setTrajectory(prev => {
        const updated = [...prev, [newPosition.lat, newPosition.lon]];
        return updated.slice(-50);
      });

      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch ISS position');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchISSPosition();

    // Set up auto-refresh every 5 seconds when live mode is on
    if (isLive) {
      intervalRef.current = setInterval(fetchISSPosition, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  if (isLoading && !issPosition) {
    return (
      <div className="h-[600px] bg-bg-secondary border border-white/10 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-electric-blue animate-spin mx-auto mb-2" />
  <p className="text-muted-gray">Loading ISS position...</p>
        </div>
      </div>
    );
  }

  if (error && !issPosition) {
    return (
      <div className="h-[600px] bg-bg-secondary border border-white/10 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Failed to load ISS tracker</p>
          <p className="text-sm text-muted-gray mb-4">{error}</p>
          <button
            onClick={fetchISSPosition}
            className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!issPosition) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="bg-bg-primary/90 backdrop-blur-sm border border-white/10 rounded-lg p-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-white font-medium">
              {isLive ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleLiveMode}
          className="bg-bg-primary/90 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors pointer-events-auto"
          title={isLive ? 'Pause updates' : 'Resume updates'}
        >
          {isLive ? (
            <Activity className="w-5 h-5 text-electric-blue" />
          ) : (
            <RefreshCw className="w-5 h-5 text-muted-gray" />
          )}
        </button>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-bg-primary/90 backdrop-blur-sm border border-white/10 rounded-lg p-4 pointer-events-none max-w-sm">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-gray mb-1">Position</p>
            <p className="text-white font-mono">
              {issPosition.lat.toFixed(4)}°, {issPosition.lon.toFixed(4)}°
            </p>
          </div>
          <div>
            <p className="text-muted-gray mb-1">Altitude</p>
            <p className="text-white font-mono">{issPosition.altitude.toFixed(1)} km</p>
          </div>
          <div>
            <p className="text-muted-gray mb-1">Velocity</p>
            <p className="text-white font-mono">{issPosition.velocity.toFixed(2)} km/s</p>
          </div>
          <div>
            <p className="text-muted-gray mb-1">Last Update</p>
            <p className="text-white font-mono text-xs">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[600px] rounded-xl overflow-hidden border border-white/10">
        <MapContainer
          center={[issPosition.lat, issPosition.lon]}
          zoom={3}
          className="h-full w-full"
          style={{ background: '#0a0e1a' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* ISS Marker */}
          <Marker position={[issPosition.lat, issPosition.lon]} icon={issIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold mb-1">International Space Station</p>
                <p className="text-xs text-gray-600">
                  Alt: {issPosition.altitude.toFixed(1)} km<br />
                  Vel: {issPosition.velocity.toFixed(2)} km/s
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Trajectory Path */}
          {trajectory.length > 1 && (
            <Polyline
              positions={trajectory}
              pathOptions={{
                color: '#00D9FF',
                weight: 2,
                opacity: 0.6,
                dashArray: '5, 5'
              }}
            />
          )}

          {/* Auto-center on ISS */}
          <MapUpdater center={isLive ? [issPosition.lat, issPosition.lon] : null} />
        </MapContainer>
      </div>

      {/* Add pulse animation style */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </motion.div>
  );
}

export { ISSMap };
