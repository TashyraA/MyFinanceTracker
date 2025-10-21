import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent, convertTo12Hour } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface MonthlyCalendarProps {
  month: string;
  events: CalendarEvent[];
  onUpdate: (events: CalendarEvent[]) => void;
  onDateSelect: (date: string) => void;
}

const MonthlyCalendar = ({ month, events, onUpdate, onDateSelect }: MonthlyCalendarProps) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const monthIndex = new Date(`${month} 1, 2025`).getMonth();
  const year = 2025;
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const today = currentTime.toISOString().split('T')[0];

  const handleAddOrUpdateEvent = () => {
    if (selectedDate && eventTitle) {
      if (editingEvent) {
        onUpdate(events.map(e => 
          e.id === editingEvent.id 
            ? { ...e, title: eventTitle, time: eventTime || undefined, description: eventDescription || undefined }
            : e
        ));
      } else {
        const newEvent: CalendarEvent = {
          id: uuidv4(),
          month,
          date: selectedDate,
          title: eventTitle,
          time: eventTime || undefined,
          description: eventDescription || undefined,
        };
        onUpdate([...events, newEvent]);
      }
      resetForm();
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    onUpdate(events.filter(e => e.id !== eventId));
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setEventTitle(event.title);
    setEventTime(event.time || '');
    setEventDescription(event.description || '');
    setShowEventForm(true);
  };

  const resetForm = () => {
    setEventTitle('');
    setEventTime('');
    setEventDescription('');
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleDateClick = (day: number) => {
    const date = `2025-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(date);
    onDateSelect(date);
    setShowEventForm(true);
  };

  const getEventsForDate = (day: number) => {
    const date = `2025-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === date && e.month === month);
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-coquette-darkBrown">{month} Calendar</h2>
        <p className="text-sm text-coquette-brown">
          Today: {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })} EST
        </p>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-coquette-brown">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (typeof day !== 'number') return day;
          const dayEvents = getEventsForDate(day);
          const dateStr = `2025-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === today;
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`h-24 p-2 border-2 rounded-lg cursor-pointer transition-colors ${
                isToday 
                  ? 'border-coquette-rose bg-coquette-pink/10' 
                  : 'border-coquette-pink/30 hover:border-coquette-pink bg-coquette-bg/30'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-coquette-rose' : 'text-coquette-darkBrown'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div 
                    key={event.id} 
                    className="text-xs bg-coquette-pink text-white px-1 py-0.5 rounded truncate flex items-center justify-between group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate flex-1">
                      {event.time && `${convertTo12Hour(event.time)} `}{event.title}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                        className="hover:bg-white/20 rounded p-0.5"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        className="hover:bg-white/20 rounded p-0.5"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-coquette-brown">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showEventForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={resetForm}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-coquette-darkBrown">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h3>
              <button onClick={resetForm} className="text-coquette-brown hover:text-coquette-darkBrown">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
              <textarea
                placeholder="Description (optional)"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
              <button
                onClick={handleAddOrUpdateEvent}
                className="w-full bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCalendar;