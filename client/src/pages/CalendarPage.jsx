import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';

import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EventCard } from '../components/home/EventCard';
import eventsData from '../data/events.json';

function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Parse events and group by date
    const parsedEvents = eventsData.map(event => ({
      ...event,
      date: parseISO(event.date)
    }));
    setEvents(parsedEvents);
  }, []);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    const dayEvents = events.filter(event => 
      isSameDay(event.date, day)
    );
    setSelectedEvents(dayEvents);
    if (dayEvents.length > 0) {
      setIsModalOpen(true);
    }
  };

  const getEventsForDate = (day) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const getEventColor = (type) => {
    const colors = {
      satellite: 'bg-electric-blue',
      planet: 'bg-cosmic-purple',
      moon: 'bg-solar-amber',
      meteor: 'bg-aurora-green',
      eclipse: 'bg-danger-red'
    };
    return colors[type] || 'bg-electric-blue';
  };

  const exportToGoogleCalendar = (event) => {
    const startDate = format(event.date, "yyyyMMdd'T'HHmmss'Z'");
    const endDate = format(addDays(event.date, 0), "yyyyMMdd'T'HHmmss'Z'");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=Sky`;
    window.open(url, '_blank');
  };

  const exportToICS = (event) => {
    const startDate = format(event.date, "yyyyMMdd'T'HHmmss'Z'");
    const endDate = format(addDays(event.date, 0), "yyyyMMdd'T'HHmmss'Z'");
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AstroView//Calendar//EN
BEGIN:VEVENT
UID:${event.id}@astroview.app
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:Sky
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAllToICS = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AstroView//Calendar//EN
`;

    events.forEach(event => {
      const startDate = format(event.date, "yyyyMMdd'T'HHmmss'Z'");
      const endDate = format(addDays(event.date, 0), "yyyyMMdd'T'HHmmss'Z'");
      
      icsContent += `BEGIN:VEVENT
UID:${event.id}@astroview.app
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:Sky
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'astroview_events.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEvents = getEventsForDate(currentDay);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isTodayDate = isToday(currentDay);

        days.push(
          <motion.button
            key={currentDay}
            onClick={() => handleDateClick(currentDay)}
            className={`
              relative min-h-[80px] sm:min-h-[100px] p-2 border border-white/10
              transition-all duration-200
              ${isCurrentMonth ? 'bg-bg-secondary' : 'bg-bg-secondary/50'}
              ${isTodayDate ? 'ring-2 ring-electric-blue' : ''}
              ${dayEvents.length > 0 ? 'hover:bg-bg-tertiary cursor-pointer' : 'cursor-default'}
            `}
            whileHover={dayEvents.length > 0 ? { scale: 1.02 } : {}}
          >
            <div className="flex flex-col h-full">
              <span className={`
                text-sm font-semibold mb-1
                ${!isCurrentMonth ? 'text-faint-gray' : isTodayDate ? 'text-electric-blue' : 'text-star-white'}
              `}>
                {format(currentDay, 'd')}
              </span>
              
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`}
                      title={event.name}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-muted-gray">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </motion.button>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-0">{rows}</div>;
  };

  return (
    <div className="min-h-screen bg-bg-primary py-6 px-3 sm:px-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <CalendarIcon className="w-7 h-7 text-electric-blue" />
            <h1 className="text-3xl font-bold font-heading text-star-white">
              Celestial Calendar
            </h1>
          </div>
          <p className="text-muted-gray text-sm">
            Plan your stargazing sessions with upcoming celestial events
          </p>
        </div>

        {/* Calendar Controls */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold font-heading text-star-white">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <Button variant="ghost" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <Button
              variant="secondary"
              onClick={exportAllToICS}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export All</span>
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted-gray py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {renderCalendar()}
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-gray">Event Types:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-electric-blue" />
            <span className="text-star-white">Satellite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cosmic-purple" />
            <span className="text-star-white">Planet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-solar-amber" />
            <span className="text-star-white">Moon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aurora-green" />
            <span className="text-star-white">Meteor</span>
          </div>
        </div>
      </motion.div>

      {/* Event Details Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Events on ${selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}`}
        >
          <div className="space-y-4">
            {selectedEvents.map(event => (
              <div key={event.id}>
                <EventCard event={event} />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => exportToGoogleCalendar(event)}
                  >
                    Google Calendar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => exportToICS(event)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download .ics
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export { CalendarPage };
