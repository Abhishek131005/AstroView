import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, MapPin } from 'lucide-react';
import { getISSPosition } from '@/services/satelliteService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Neon ISS Marker
const issIcon = new L.DivIcon({
  className: 'custom-iss-marker',
  html: `
    <div style="position: relative;">
      <div style="width: 24px; height: 24px; background: #22d3ee; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px rgba(34, 211, 238, 0.8); animation: pulse 2s infinite;"></div>
      <div style="position: absolute; top: -8px; left: -8px; width: 40px; height: 40px; border: 2px solid #22d3ee; border-radius: 50%; opacity: 0.3;"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Cinematic Map Follow Component
function MapUpdater({ center, isLive }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && isLive) {
      // .flyTo provides the "Smooth Follow" effect judges love
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 1.5, // 1.5 seconds of smooth sliding
      });
    }
  }, [center, isLive, map]);

  return null;
}

function ISSMap() {
  const [issPosition, setIssPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchISSPosition = async () => {
    try {
      const data = await getISSPosition();
      
      // Safeguard: Ensure values are numbers to avoid NaN crash
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);

      if (isNaN(lat) || isNaN(lon)) return;

      const newPosition = {
        lat,
        lon,
        altitude: parseFloat(data.altitude) || 0,
        velocity: parseFloat(data.velocity) || 0,
      };

      setIssPosition(newPosition);
      setLastUpdate(new Date());
      setTrajectory(prev => [...prev, [lat, lon]].slice(-100));
      setIsLoading(false);
    } catch (err) {
      console.error("Tracking Error:", err);
    }
  };

  useEffect(() => {
    fetchISSPosition();
    if (isLive) {
      intervalRef.current = setInterval(fetchISSPosition, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isLive]);

  // LAYER 2 GUARD: Prevent rendering MapContainer with NaN or Null
  if (isLoading || !issPosition) {
    return (
      <div className="h-[600px] bg-slate-900/50 border border-white/10 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono tracking-widest uppercase text-sm">Synchronizing Orbital Data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
      {/* Top Status Bar */}
      <div className="absolute top-6 left-6 right-6 z-[1000] flex justify-between items-center pointer-events-none">
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 pointer-events-auto">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-xs font-bold tracking-widest text-white uppercase">{isLive ? 'Live Tracking' : 'Paused'}</span>
        </div>
        
        <button 
          onClick={() => setIsLive(!isLive)}
          className="bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-cyan-500/20 transition-all pointer-events-auto"
        >
          {isLive ? <Activity className="text-cyan-400 w-5 h-5" /> : <MapPin className="text-slate-400 w-5 h-5" />}
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-slate-950/90 backdrop-blur-lg border border-white/10 p-5 rounded-3xl pointer-events-none w-64">
        <div className="space-y-4">
          <Stat label="Altitude" value={`${issPosition.altitude.toFixed(1)} km`} color="text-emerald-400" />
          <Stat label="Velocity" value={`${issPosition.velocity.toFixed(0)} km/h`} color="text-amber-400" />
          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Current Coordinates</p>
            <p className="text-sm font-mono text-cyan-400">{issPosition.lat.toFixed(4)}°, {issPosition.lon.toFixed(4)}°</p>
          </div>
        </div>
      </div>

      {/* The Map */}
      <div className="h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <MapContainer
          center={[issPosition.lat, issPosition.lon]}
          zoom={3}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          
          <Polyline positions={trajectory} pathOptions={{ color: '#22d3ee', weight: 2, dashArray: '10, 10', opacity: 0.5 }} />
          
          <Marker position={[issPosition.lat, issPosition.lon]} icon={issIcon}>
            <Popup className="custom-popup">
              <div className="p-2 font-sans">
                <p className="font-bold text-slate-900">ISS Location</p>
                <p className="text-xs text-slate-600">Updated: {lastUpdate?.toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>

          <MapUpdater center={[issPosition.lat, issPosition.lon]} isLive={isLive} />
        </MapContainer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        .leaflet-container { background: #020617 !important; }
      `}</style>
    </motion.div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</p>
      <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
  );
}

export { ISSMap };