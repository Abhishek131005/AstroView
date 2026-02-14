import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { RefreshCw, Flame, CloudRain, Wind, Snowflake, AlertTriangle } from 'lucide-react';
import { getEONETEvents } from '@/services/nasaService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Event type configuration
const EVENT_TYPES = {
  'wildfires': { color: '#ef4444', icon: Flame, label: 'Wildfires' },
  'storms': { color: '#3b82f6', icon: CloudRain, label: 'Storms' },
  'volcanoes': { color: '#f97316', icon: AlertTriangle, label: 'Volcanoes' },
  'floods': { color: '#06b6d4', icon: Wind, label: 'Floods' },
  'drought': { color: '#a16207', icon: Snowflake, label: 'Drought' },
  'default': { color: '#8b5cf6', icon: AlertTriangle, label: 'Other' }
};

// Custom marker icons
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-event-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

function EarthEventsMap() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(['wildfires', 'storms', 'volcanoes', 'floods']);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getEONETEvents();
      const mappedEvents = (data.events || []).map(event => ({
        id: event.id,
        title: event.title,
        category: event.categories?.[0]?.id || 'default',
        geometry: event.geometry?.[0],
        date: event.geometry?.[0]?.date
      })).filter(event => event.geometry && event.geometry.coordinates);

      setEvents(mappedEvents);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch Earth events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventType = (categoryId) => {
    const normalized = categoryId.toLowerCase();
    if (normalized.includes('fire') || normalized.includes('wildfire')) return 'wildfires';
    if (normalized.includes('storm') || normalized.includes('hurricane') || normalized.includes('cyclone')) return 'storms';
    if (normalized.includes('volcano')) return 'volcanoes';
    if (normalized.includes('flood')) return 'floods';
    if (normalized.includes('drought')) return 'drought';
    return 'default';
  };

  const filteredEvents = events.filter(event => {
    const type = getEventType(event.category);
    return selectedTypes.includes(type);
  });

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="h-[500px] bg-bg-secondary border border-white/10 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-electric-blue animate-spin mx-auto mb-2" />
          <p className="text-muted-gray">Loading Earth events...</p>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="h-[500px] bg-bg-secondary border border-white/10 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Failed to load Earth events</p>
          <p className="text-sm text-muted-gray mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {Object.entries(EVENT_TYPES).filter(([key]) => key !== 'default').map(([type, config]) => {
            const Icon = config.icon;
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/5 text-muted-gray hover:bg-white/10'
                }`}
                style={isSelected ? { borderColor: config.color } : {}}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                {config.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={fetchEvents}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title="Refresh events"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 text-muted-gray ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Map */}
      <div className="h-[500px] rounded-xl overflow-hidden border border-white/10">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="h-full w-full"
style={{ background: '#0a0e1a' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {filteredEvents.map(event => {
            const type = getEventType(event.category);
            const config = EVENT_TYPES[type] || EVENT_TYPES.default;
            const [lon, lat] = event.geometry.coordinates;

            return (
              <Marker
                key={event.id}
                position={[lat, lon]}
                icon={createMarkerIcon(config.color)}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold mb-1">{event.title}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      Type: {config.label}
                    </p>
                    {event.date && (
                      <p className="text-xs text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-gray">
          Showing {filteredEvents.length} of {events.length} active events
        </p>
        {lastUpdate && (
          <p className="text-muted-gray">
            Updated {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export { EarthEventsMap };
