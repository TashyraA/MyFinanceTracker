import { useState } from 'react';
import { Clock, X, Edit2, Check } from 'lucide-react';
import { CalendarEvent } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface DailyScheduleWithTimesProps {
  selectedDate: string;
  events: CalendarEvent[];
  onUpdate: (events: CalendarEvent[]) => void;
}

const DailyScheduleWithTimes = ({ selectedDate, events, onUpdate }: DailyScheduleWithTimesProps) => {
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const timeSlots = [
    '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
    '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
  ];

  const convertTo24Hour = (time12: string): string => {
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const getEventForTime = (timeSlot: string) => {
    const time24 = convertTo24Hour(timeSlot);
    return events.find(e => e.date === selectedDate && e.time === time24);
  };

  const handleAddOrUpdate = (timeSlot: string) => {
    if (!editText.trim()) return;
    const time24 = convertTo24Hour(timeSlot);
    const existingEvent = getEventForTime(timeSlot);
    if (existingEvent) {
      onUpdate(events.map(e => 
        e.id === existingEvent.id 
          ? { ...e, title: editText.trim() }
          : e
      ));
    } else {
      const newEvent: CalendarEvent = {
        id: uuidv4(),
        month: new Date(selectedDate).toLocaleDateString('en-US', { month: 'long' }),
        date: selectedDate,
        title: editText.trim(),
        time: time24,
      };
      onUpdate([...events, newEvent]);
    }
    setEditingTime(null);
    setEditText('');
  };

  const handleDelete = (eventId: string) => {
    onUpdate(events.filter(e => e.id !== eventId));
  };

  const startEdit = (timeSlot: string) => {
    const event = getEventForTime(timeSlot);
    setEditingTime(timeSlot);
    setEditText(event?.title || '');
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Daily Planner</h2>
      </div>

      <p className="text-sm text-coquette-brown mb-4">
        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {timeSlots.map((timeSlot) => {
          const event = getEventForTime(timeSlot);
          const isEditing = editingTime === timeSlot;
          return (
            <div 
              key={timeSlot}
              className="flex items-center gap-3 p-3 bg-coquette-bg rounded-lg border border-coquette-pink/30 hover:border-coquette-pink transition-colors"
            >
              <div className="flex-shrink-0 w-20 text-sm font-medium text-coquette-rose">
                {timeSlot}
              </div>
              
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOrUpdate(timeSlot)}
                    placeholder="What are you doing?"
                    className="flex-1 px-3 py-1 border-2 border-coquette-pink rounded-lg focus:outline-none text-sm text-coquette-darkBrown"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddOrUpdate(timeSlot)}
                    className="p-1 bg-coquette-pink text-white rounded hover:bg-coquette-rose transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTime(null);
                      setEditText('');
                    }}
                    className="p-1 bg-coquette-taupe text-white rounded hover:bg-coquette-brown transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : event ? (
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-coquette-darkBrown">{event.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(timeSlot)}
                      className="p-1 text-coquette-brown hover:bg-coquette-pink/20 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-1 text-coquette-deep hover:bg-coquette-pink/10 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(timeSlot)}
                  className="flex-1 text-left text-sm text-coquette-brown/50 hover:text-coquette-brown transition-colors"
                >
                  Click to add activity...
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyScheduleWithTimes;
