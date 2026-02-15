import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Flame, CloudRain, Wind, Snowflake, AlertTriangle, TrendingUp, MapPin, Clock, Activity } from 'lucide-react';
import { getEONETEvents } from '@/services/nasaService';
import { Card } from '@/components/common/Card';
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('map'); // 'map' or 'list'

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

  // Calculate statistics
  const eventStats = Object.entries(EVENT_TYPES)
    .filter(([key]) => key !== 'default')
    .map(([type, config]) => ({
      type,
      config,
      count: filteredEvents.filter(e => getEventType(e.category) === type).length
    }));

  const recentEvents = [...filteredEvents]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

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
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {eventStats.map(({ type, config, count }) => {
          const Icon = config.icon;
          return (
            <Card key={type} className="!p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-gray mb-1">{config.label}</p>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
                <Icon className="w-8 h-8 opacity-50" style={{ color: config.color }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* View Toggle & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView('map')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === 'map'
                ? 'bg-electric-blue text-white'
                : 'bg-white/5 text-muted-gray hover:bg-white/10'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === 'list'
                ? 'bg-electric-blue text-white'
                : 'bg-white/5 text-muted-gray hover:bg-white/10'
            }`}
          >
            List View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-gray">
            <Activity className="w-4 h-4 text-green-400" />
            <span>Live</span>
          </div>
          <button
            onClick={fetchEvents}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Refresh events"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-muted-gray ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(EVENT_TYPES).filter(([key]) => key !== 'default').map(([type, config]) => {
          const Icon = config.icon;
          const isSelected = selectedTypes.includes(type);
          const count = eventStats.find(s => s.type === type)?.count || 0;
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/5 text-muted-gray hover:bg-white/10'
              }`}
              style={isSelected ? { borderColor: config.color } : {}}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
              {config.label}
              <span className="ml-1 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Map or List View */}
      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[500px] rounded-xl overflow-hidden border border-white/10"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredEvents.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-muted-gray">No events match the selected filters</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredEvents.map(event => {
                  const type = getEventType(event.category);
                  const config = EVENT_TYPES[type] || EVENT_TYPES.default;
                  const Icon = config.icon;
                  const [lon, lat] = event.geometry.coordinates;

                  return (
                    <Card
                      key={event.id}
                      className="!p-3 cursor-pointer hover:border-electric-blue/50"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${config.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: config.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white mb-1 truncate">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-muted-gray">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {lat.toFixed(2)}°, {lon.toFixed(2)}°
                            </span>
                            {event.date && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                              style={{
                                backgroundColor: `${config.color}20`,
                                color: config.color
                              }}
                            >
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Events Summary */}
      <Card className="!p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-electric-blue" />
            <h3 className="text-sm font-semibold text-white">Recent Events</h3>
          </div>
          <span className="text-xs text-muted-gray">Last 24 hours</span>
        </div>
        <div className="space-y-2">
          {recentEvents.length === 0 ? (
            <p className="text-xs text-muted-gray text-center py-2">No recent events</p>
          ) : (
            recentEvents.map(event => {
              const type = getEventType(event.category);
              const config = EVENT_TYPES[type] || EVENT_TYPES.default;
              const Icon = config.icon;
              
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: config.color }} />
                  <p className="text-xs text-white flex-1 truncate">{event.title}</p>
                  {event.date && (
                    <span className="text-xs text-muted-gray">
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <p className="text-muted-gray">
            Showing <span className="text-white font-semibold">{filteredEvents.length}</span> of {events.length} active events
          </p>
          <p className="text-muted-gray">
            Data from <span className="text-electric-blue">NASA EONET</span>
          </p>
        </div>
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
