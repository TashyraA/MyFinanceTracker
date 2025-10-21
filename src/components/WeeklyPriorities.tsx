import { useState } from 'react';
import { CalendarEvent, getCurrentWeekDates, convertTo12Hour } from '@/lib/storage';
import { Star, Edit2, Trash2, X, Check } from 'lucide-react';

interface WeeklyPrioritiesProps {
  events: CalendarEvent[];
  onUpdate: (events: CalendarEvent[]) => void;
}

const WeeklyPriorities = ({ events, onUpdate }: WeeklyPrioritiesProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');

  const weekDates = getCurrentWeekDates();
  const weekEvents = events.filter(e => weekDates.includes(e.date));

  const handleDelete = (id: string) => {
    onUpdate(events.filter(e => e.id !== id));
  };

  const startEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setEditTitle(event.title);
    setEditTime(event.time || '');
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onUpdate(events.map(e => 
        e.id === editingId 
          ? { ...e, title: editTitle.trim(), time: editTime || undefined }
          : e
      ));
      setEditingId(null);
      setEditTitle('');
      setEditTime('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditTime('');
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">This Week's Focus</h2>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {weekEvents.length > 0 ? (
          weekEvents.map(event => (
            <div key={event.id} className="p-3 bg-coquette-bg rounded-lg border border-coquette-pink/30">
              {editingId === event.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 border-2 border-coquette-pink rounded text-sm focus:outline-none"
                    placeholder="Event title"
                  />
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-2 py-1 border-2 border-coquette-pink rounded text-sm focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={14} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-coquette-darkBrown">{event.title}</p>
                    <p className="text-sm text-coquette-brown">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {event.time && ` at ${convertTo12Hour(event.time)}`}
                    </p>
                    {event.description && (
                      <p className="text-xs text-coquette-brown mt-1">{event.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => startEdit(event)}
                      className="p-1 text-coquette-brown hover:bg-coquette-pink/20 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-coquette-brown">
            <p className="text-sm">No events this week. Add events to your calendar to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPriorities;