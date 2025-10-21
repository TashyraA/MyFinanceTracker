import { Clock } from 'lucide-react';
import { CalendarEvent } from '@/lib/storage';

interface DailyScheduleProps {
  selectedDate: string;
  events: CalendarEvent[];
  onUpdate: (events: CalendarEvent[]) => void;
}

const DailySchedule = ({ selectedDate, events }: DailyScheduleProps) => {
  const dayEvents = events
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Daily Schedule</h2>
      </div>

      <p className="text-sm text-coquette-brown mb-4">
        {new Date(selectedDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {dayEvents.length > 0 ? (
          dayEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-coquette-bg rounded-lg border border-coquette-pink/30 hover:border-coquette-pink hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                {event.time && (
                  <div className="flex-shrink-0 text-sm font-medium text-coquette-rose">
                    {event.time}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-coquette-darkBrown">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-coquette-brown mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-coquette-bg rounded-lg border border-coquette-pink/20">
            <p className="text-sm text-coquette-brown">
              ✨ No events scheduled for this day
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySchedule;
