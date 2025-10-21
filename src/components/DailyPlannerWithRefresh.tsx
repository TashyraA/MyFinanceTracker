import { useState, useEffect } from 'react';
import { Clock, Plus, X, RefreshCw } from 'lucide-react';
import { DailyTask, convertTo12Hour, convertTo24Hour } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface DailyPlannerWithRefreshProps {
  dailyTasks: DailyTask[];
  lastDate?: string;
  onUpdate: (tasks: DailyTask[], lastDate: string) => void;
}

const DailyPlannerWithRefresh = ({ dailyTasks, lastDate, onUpdate }: DailyPlannerWithRefreshProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = currentTime.toISOString().split('T')[0];
  
  const todayTasks = dailyTasks.filter(t => t.date === today);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lastDate && lastDate !== today) {
      onUpdate(dailyTasks.filter(t => t.date !== lastDate), today);
    }
  }, [today]);

  const timeSlots = [
    '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
    '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
  ];

  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const getTaskForTime = (timeSlot: string) => {
    const time24 = convertTo24Hour(timeSlot);
    return todayTasks.find(t => t.time === time24);
  };

  const handleAddOrUpdate = (timeSlot: string) => {
    if (!editText.trim()) return;
    const time24 = convertTo24Hour(timeSlot);
    const existingTask = getTaskForTime(timeSlot);
    if (existingTask) {
      onUpdate(
        dailyTasks.map(t => t.id === existingTask.id ? { ...t, task: editText.trim() } : t),
        today
      );
    } else {
      const newTask: DailyTask = {
        id: uuidv4(),
        date: today,
        time: time24,
        task: editText.trim(),
      };
      onUpdate([...dailyTasks, newTask], today);
    }
    setEditingTime(null);
    setEditText('');
  };

  const handleDelete = (taskId: string) => {
    onUpdate(dailyTasks.filter(t => t.id !== taskId), today);
  };

  const handleNewDay = () => {
    if (confirm('Clear all tasks and start a new day?')) {
      onUpdate(dailyTasks.filter(t => t.date !== today), today);
    }
  };

  const startEdit = (timeSlot: string) => {
    const task = getTaskForTime(timeSlot);
    setEditingTime(timeSlot);
    setEditText(task?.task || '');
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Daily Planner</h2>
        </div>
        <button
          onClick={handleNewDay}
          className="flex items-center gap-2 bg-coquette-pink text-white px-3 py-1 rounded-lg hover:bg-coquette-rose transition-colors text-sm"
        >
          <RefreshCw size={16} />
          New Day
        </button>
      </div>

      <div className="mb-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-sm font-medium text-coquette-darkBrown">
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-xs text-coquette-brown">
          Current time: {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })} EST
        </p>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {timeSlots.map((timeSlot) => {
          const task = getTaskForTime(timeSlot);
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
                    <Plus size={16} />
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
              ) : task ? (
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-coquette-darkBrown">{task.task}</p>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 text-coquette-deep hover:bg-coquette-pink/10 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
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

      <div className="mt-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown">
          💡 Tasks are separate from calendar events and reset each day
        </p>
      </div>
    </div>
  );
};

export default DailyPlannerWithRefresh;
