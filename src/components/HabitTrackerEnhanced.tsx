import { useState } from 'react';
import { Plus, Trash2, Target, Check } from 'lucide-react';
import { HabitTracker, getCurrentWeekDates } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface HabitTrackerEnhancedProps {
  month: string;
  habits: HabitTracker[];
  onUpdate: (habits: HabitTracker[]) => void;
}

const HabitTrackerEnhanced = ({ month, habits, onUpdate }: HabitTrackerEnhancedProps) => {
  const [newHabit, setNewHabit] = useState('');

  const monthHabits = habits.filter(h => h.month === month);
  const weekDates = getCurrentWeekDates();

  const handleAdd = () => {
    if (newHabit.trim()) {
      const habit: HabitTracker = {
        id: uuidv4(),
        month,
        habit: newHabit.trim(),
        completedDates: [],
      };
      onUpdate([...habits, habit]);
      setNewHabit('');
    }
  };

  const handleToggleDate = (habitId: string, date: string) => {
    onUpdate(habits.map(h => {
      if (h.id === habitId) {
        const completedDates = h.completedDates.includes(date)
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date];
        return { ...h, completedDates };
      }
      return h;
    }));
  };

  const handleDelete = (id: string) => {
    onUpdate(habits.filter(h => h.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Habit Tracker</h2>
        </div>
      </div>

      <div className="mb-3 p-2 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown text-center">
          {new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-4 mb-4">
        {monthHabits.map(habit => (
          <div key={habit.id} className="p-4 bg-coquette-bg rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-coquette-darkBrown">{habit.habit}</p>
              <button
                onClick={() => handleDelete(habit.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const isCompleted = habit.completedDates.includes(date);
                const dayNum = new Date(date).getDate();
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayName = dayNames[index];
                
                return (
                  <div key={date} className="flex flex-col items-center">
                    <button
                      onClick={() => handleToggleDate(habit.id, date)}
                      className={`w-full aspect-square rounded-lg transition-all flex flex-col items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white border-2 border-coquette-pink/30 hover:border-coquette-pink text-coquette-brown'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="flex flex-col items-center">
                          <Check size={20} />
                          <span className="text-xs mt-1">Done</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold">{dayNum}</span>
                          <span className="text-xs">{dayName}</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-2 text-xs text-coquette-brown text-center">
              {habit.completedDates.filter(d => weekDates.includes(d)).length} / {weekDates.length} completed this week
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new habit..."
          className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
        />
        <button
          onClick={handleAdd}
          className="bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add
        </button>
      </div>
    </div>
  );
};

export default HabitTrackerEnhanced;