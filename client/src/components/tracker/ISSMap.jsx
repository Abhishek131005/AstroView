import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, MapPin, Radio, Zap } from 'lucide-react';
import { getISSPosition } from '@/services/satelliteService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Haversine Formula: Calculate distance between two lat/lon points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Neon ISS Marker with Signal Ping Animation
const issIcon = new L.DivIcon({
  className: 'custom-iss-marker',
  html: `
    <div style="position: relative;">
      <!-- Pulsing Rings -->
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; border: 2px solid #22d3ee; border-radius: 50%; opacity: 0.3; animation: radar-ping 2s ease-out infinite;"></div>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; border: 2px solid #22d3ee; border-radius: 50%; opacity: 0.3; animation: radar-ping 2s ease-out infinite 0.5s;"></div>
      <!-- Core Icon -->
      <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%); border-radius: 50%; border: 4px solid white; box-shadow: 0 0 25px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(255,255,255,0.4);"></div>
    </div>
  `,
  iconSize: [60, 60],
  iconAnchor: [30, 30],
});

// User Location Marker with Glassmorphic Style
const userIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `
    <div style="position: relative;">
      <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #00E676 0%, #00C853 100%); border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(0, 230, 118, 0.7);"></div>
      <div style="position: absolute; top: -4px; left: -4px; width: 32px; height: 32px; border: 2px solid rgba(0, 230, 118, 0.4); border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Cinematic Map Follow Component
function MapUpdater({ issCenter, userCenter, isLive, shouldFollowISS }) {
  const map = useMap();
  
  useEffect(() => {
    if (issCenter && userCenter && !shouldFollowISS) {
      // On initial load, fit bounds to show both ISS and user
      const bounds = L.latLngBounds([issCenter, userCenter]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });
    } else if (issCenter && isLive && shouldFollowISS) {
      // Follow ISS when live tracking
      map.flyTo(issCenter, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [issCenter, userCenter, isLive, shouldFollowISS, map]);

  return null;
}

function ISSMap({ userLocation }) {
  const [issPosition, setIssPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [shouldFollowISS, setShouldFollowISS] = useState(false);
  const [distanceToISS, setDistanceToISS] = useState(null);
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
      
      // Calculate distance from user to ISS
      if (userLocation && userLocation.lat && userLocation.lon) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          lat,
          lon
        );
        setDistanceToISS(distance);
      }
      
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
      <div className="h-[600px] bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Radio className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-slate-300 font-mono tracking-widest uppercase text-sm">Synchronizing Orbital Data...</p>
          <p className="text-slate-500 text-xs mt-2">Establishing satellite link</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
      {/* Top Status Bar - Glassmorphic */}
      <div className="absolute top-6 left-6 right-6 z-[1000] flex justify-between items-center pointer-events-none gap-4">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full flex items-center gap-3 pointer-events-auto shadow-lg">
          <motion.div 
            className={`w-3 h-3 rounded-full ${isLive ? 'bg-cyan-400' : 'bg-slate-600'}`}
            animate={isLive ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-bold tracking-widest text-white uppercase">
            {isLive ? '●  LIVE TRACKING' : 'PAUSED'}
          </span>
          <Zap className={`w-4 h-4 ${isLive ? 'text-cyan-400' : 'text-slate-600'}`} />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsLive(!isLive)}
            className="bg-slate-950/80 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-full hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all pointer-events-auto shadow-lg"
          >
            {isLive ? 
              <Activity className="text-cyan-400 w-5 h-5" /> : 
              <MapPin className="text-slate-400 w-5 h-5" />
            }
          </button>
        </div>
      </div>

      {/* Enhanced Stats Dashboard - Glassmorphic */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-slate-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-3xl pointer-events-none w-80 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Telemetry</h4>
        </div>
        
        <div className="space-y-4">
          <Stat label="Altitude" value={`${issPosition.altitude.toFixed(1)} km`} color="text-emerald-400" />
          <Stat label="Velocity" value={`${issPosition.velocity.toFixed(0)} km/h`} color="text-amber-400" />
          
          {distanceToISS && (
            <Stat 
              label="Distance from You" 
              value={`${distanceToISS.toFixed(0)} km`} 
              color="text-cyan-400" 
            />
          )}
          
          <div className="pt-3 border-t border-white/10">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ISS Coordinates</p>
            <p className="text-sm font-mono text-cyan-400 mt-1">
              {issPosition.lat.toFixed(4)}°, {issPosition.lon.toFixed(4)}°
            </p>
          </div>
          
          {userLocation && (
            <div className="pt-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Your Location</p>
              <p className="text-xs font-mono text-emerald-400 mt-1">
                {userLocation.lat.toFixed(4)}°, {userLocation.lon.toFixed(4)}°
              </p>
            </div>
          )}
        </div>
      </div>

      {/* The Map with High-Res Satellite View */}
      <div className="h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lon] : [issPosition.lat, issPosition.lon]}
          zoom={3}
          className="h-full w-full"
          zoomControl={false}
        >
          {/* High-Resolution Satellite Imagery */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            maxZoom={19}
          />
          
          {/* Dark Labels Overlay for Night View Effect */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
            opacity={0.7}
          />
          
          {/* Orbital Trajectory */}
          <Polyline 
            positions={trajectory} 
            pathOptions={{ 
              color: '#22d3ee', 
              weight: 3, 
              dashArray: '10, 10', 
              opacity: 0.6,
              className: 'trajectory-glow'
            }} 
          />
          
          {/* Line-of-Sight Polyline */}
          {userLocation && (
            <Polyline 
              positions={[
                [userLocation.lat, userLocation.lon],
                [issPosition.lat, issPosition.lon]
              ]}
              pathOptions={{
                color: '#00E676',
                weight: 2,
                dashArray: '5, 10',
                opacity: 0.5,
                className: 'los-line'
              }}
            />
          )}
          
          {/* ISS Marker */}
          <Marker position={[issPosition.lat, issPosition.lon]} icon={issIcon}>
            <Popup className="custom-popup">
              <div className="p-3 font-sans bg-slate-950/95 backdrop-blur-md">
                <p className="font-bold text-cyan-400 text-sm">International Space Station</p>
                <p className="text-xs text-slate-300 mt-1">Updated: {lastUpdate?.toLocaleTimeString()}</p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alt:</span>
                    <span className="text-white font-mono">{issPosition.altitude.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vel:</span>
                    <span className="text-white font-mono">{issPosition.velocity.toFixed(0)} km/h</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* User Location Marker */}
          {userLocation && (
            <>
              <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                <Popup className="custom-popup">
                  <div className="p-3 font-sans bg-slate-950/95 backdrop-blur-md">
                    <p className="font-bold text-emerald-400 text-sm">Ground Station</p>
                    <p className="text-xs text-slate-300 mt-1">{userLocation.name || 'Your Position'}</p>
                  </div>
                </Popup>
              </Marker>
              
              {/* Visual Range Circle */}
              <Circle
                center={[userLocation.lat, userLocation.lon]}
                radius={500000}
                pathOptions={{
                  fillColor: '#00E676',
                  fillOpacity: 0.05,
                  color: '#00E676',
                  weight: 1,
                  opacity: 0.3,
                  dashArray: '5, 10'
                }}
              />
            </>
          )}

          <MapUpdater 
            issCenter={[issPosition.lat, issPosition.lon]} 
            userCenter={userLocation ? [userLocation.lat, userLocation.lon] : null}
            isLive={isLive} 
            shouldFollowISS={shouldFollowISS}
          />
        </MapContainer>
      </div>

      <style>{`
        @keyframes radar-ping {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .leaflet-container { 
          background: #020617 !important; 
        }
        .trajectory-glow {
          filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.6));
        }
        .los-line {
          filter: drop-shadow(0 0 3px rgba(0, 230, 118, 0.5));
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(2, 6, 23, 0.95) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(2, 6, 23, 0.95) !important;
        }
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