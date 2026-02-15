import { useState, useMemo, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc, AlertCircle, MapPin } from 'lucide-react';
import { EventCard } from './EventCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { LocationContext } from '@/context/LocationContext';
import { getUpcomingCelestialEvents } from '@/services/eventService';

function EventList() {
  const { location } = useContext(LocationContext);
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'satellite', label: 'Satellites' },
    { value: 'planet', label: 'Planets' },
    { value: 'moon', label: 'Moon' },
    { value: 'solar', label: 'Solar' },
    { value: 'aurora', label: 'Aurora' },
    { value: 'deep-sky', label: 'Deep Sky' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'visibility', label: 'Visibility' },
    { value: 'type', label: 'Type' }
  ];

  // Fetch events when component mounts or location changes
  useEffect(() => {
    const fetchEvents = async () => {
      if (!location.lat || !location.lon) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const celestialEvents = await getUpcomingCelestialEvents(location.lat, location.lon, 7);
        setEvents(celestialEvents);
      } catch (err) {
        console.error('Error fetching celestial events:', err);
        setError('Failed to load events. Please try again later.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [location.lat, location.lon]);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'visibility': {
          const visibilityOrder = { excellent: 0, good: 1, fair: 2, poor: 3 };
          return (visibilityOrder[a.visibility] || 99) - (visibilityOrder[b.visibility] || 99);
        }
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return sorted;
  }, [events, selectedType, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        message="Failed to load events"
        description={error}
      />
    );
  }

  if (!location.lat || !location.lon) {
    return (
      <EmptyState
        icon={MapPin}
        message="Location required"
        description="Please set your location to see personalized celestial events for your area."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Event Type Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-gray" />
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === type.value
                    ? 'bg-electric-blue text-white'
                    : 'bg-white/5 text-muted-gray hover:bg-white/10 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-muted-gray" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-bg-secondary border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-electric-blue/50 transition-colors"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredAndSortedEvents.length === 0 ? (
        <EmptyState
          icon={Filter}
          message="No events found"
          description="Try adjusting your filters to see more results."
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredAndSortedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      )}

      {/* Event Count */}
      <div className="text-center text-sm text-muted-gray">
        Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''} in the next 7 days
      </div>
    </div>
  );
}

export { EventList };
