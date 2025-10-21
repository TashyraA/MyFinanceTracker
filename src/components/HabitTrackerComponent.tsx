import { useState } from 'react';
import { Plus, Check, Trash2, Target } from 'lucide-react';
import { HabitTracker } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface HabitTrackerComponentProps {
  month: string;
  habits: HabitTracker[];
  onUpdate: (habits: HabitTracker[]) => void;
}

const HabitTrackerComponent = ({ month, habits, onUpdate }: HabitTrackerComponentProps) => {
  const [newHabit, setNewHabit] = useState('');

  const monthHabits = habits.filter(h => h.month === month);

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

  const today = new Date().toISOString().split('T')[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Habit Tracker</h2>
      </div>

      <div className="space-y-3 mb-4">
        {monthHabits.map(habit => (
          <div key={habit.id} className="p-3 bg-coquette-bg rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-coquette-darkBrown">{habit.habit}</p>
              <button
                onClick={() => handleDelete(habit.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex gap-1">
              {last7Days.map(date => (
                <button
                  key={date}
                  onClick={() => handleToggleDate(habit.id, date)}
                  className={`flex-1 h-8 rounded transition-all ${
                    habit.completedDates.includes(date)
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-coquette-pink/30 hover:border-coquette-pink'
                  }`}
                >
                  {habit.completedDates.includes(date) && <Check size={16} className="mx-auto" />}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-coquette-brown mt-1">
              {last7Days.map(date => (
                <span key={date} className="flex-1 text-center">
                  {new Date(date).getDate()}
                </span>
              ))}
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

export default HabitTrackerComponent;