import { useState, useEffect, useContext } from 'react';
import { Bell, X, Clock, Satellite, Moon, Sun } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import { Badge } from './Badge';
import { LocationContext } from '../../context/LocationContext';
import { getUpcomingCelestialEvents } from '../../services/eventService';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export { NotificationCenter };

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useLocalStorage('readNotifications', []);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { location } = useContext(LocationContext);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!location.lat || !location.lon) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get events for next 2 days
        const events = await getUpcomingCelestialEvents(location.lat, location.lon, 2);
        
        // Filter events within next 48 hours
        const now = new Date();
        const upcoming = events
          .map(event => ({
            ...event,
            date: parseISO(event.date)
          }))
          .filter(event => {
            const eventDate = event.date;
            const hoursUntil = (eventDate - now) / (1000 * 60 * 60);
            return hoursUntil > 0 && hoursUntil <= 48;
          })
          .sort((a, b) => a.date - b.date)
          .slice(0, 10); // Limit to 10 notifications
        
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [location.lat, location.lon]);

  const unreadCount = upcomingEvents.filter(
    event => !readNotifications.includes(event.id)
  ).length;

  const handleMarkAsRead = (eventId) => {
    if (!readNotifications.includes(eventId)) {
      setReadNotifications([...readNotifications, eventId]);
    }
  };

  const handleMarkAllAsRead = () => {
    const allIds = upcomingEvents.map(e => e.id);
    setReadNotifications(allIds);
  };

  const handleClearAll = () => {
    setReadNotifications([]);
  };

  const getEventIcon = (type) => {
    const iconClass = "w-4 h-4 text-electric-blue";
    switch (type) {
      case 'satellite':
        return <Satellite className={iconClass} />;
      case 'moon':
        return <Moon className={iconClass} />;
      case 'planet':
        return <Sun className={iconClass} />;
      case 'solar':
      case 'aurora':
        return <Sun className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-bg-tertiary transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-star-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-danger-red text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-bg-secondary border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold font-heading text-star-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-gray">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5 text-muted-gray" />
                </button>
              </div>

              {/* Actions */}
              {upcomingEvents.length > 0 && (
                <div className="flex gap-2 px-4 py-2 border-b border-white/10">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-electric-blue hover:text-electric-blue/80 transition-colors"
                  >
                    Mark all read
                  </button>
                  <span className="text-muted-gray">•</span>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-muted-gray hover:text-star-white transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Clock className="w-12 h-12 text-electric-blue mx-auto mb-3 animate-spin" />
                    <p className="text-muted-gray">Loading events...</p>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-gray mx-auto mb-3" />
                    <p className="text-muted-gray">No upcoming events in the next 48 hours</p>
                    {(!location.lat || !location.lon) && (
                      <p className="text-xs text-amber-400 mt-2">Set your location to see personalized events</p>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {upcomingEvents.map(event => {
                      const isRead = readNotifications.includes(event.id);
                      return (
                        <motion.button
                          key={event.id}
                          onClick={() => handleMarkAsRead(event.id)}
                          className={`
                            w-full text-left p-4 transition-colors duration-200
                            ${isRead ? 'bg-bg-secondary' : 'bg-bg-secondary/50 hover:bg-bg-tertiary'}
                          `}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              mt-1 p-2 rounded-lg
                              ${isRead ? 'bg-bg-tertiary' : 'bg-electric-blue/20'}
                            `}>
                              {getEventIcon(event.type)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={`
                                  text-sm font-semibold
                                  ${isRead ? 'text-muted-gray' : 'text-star-white'}
                                `}>
                                  {event.name}
                                </h4>
                                {!isRead && (
                                  <div className="w-2 h-2 bg-electric-blue rounded-full mt-1" />
                                )}
                              </div>
                              
                              <p className="text-xs text-muted-gray mb-2">
                                {formatDistanceToNow(event.date, { addSuffix: true })}
                              </p>
                              
                              <p className={`
                                text-sm line-clamp-2
                                ${isRead ? 'text-muted-gray' : 'text-star-white'}
                              `}>
                                {event.description}
                              </p>
                              
                              <div className="mt-2">
                                <Badge variant={event.visibility === 'excellent' ? 'active' : 'planned'}>
                                  {event.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
