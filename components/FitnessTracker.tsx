import { useState } from 'react';
import { Plus, Trash2, Dumbbell, Check } from 'lucide-react';
import { FitnessLog } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface FitnessTrackerProps {
  selectedDate: string;
  logs: FitnessLog[];
  onUpdate: (logs: FitnessLog[]) => void;
}

const FitnessTracker = ({ selectedDate, logs, onUpdate }: FitnessTrackerProps) => {
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const todayLogs = logs.filter(l => l.date === selectedDate);
  const totalDuration = todayLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalCalories = todayLogs.reduce((sum, log) => sum + (log.calories || 0), 0);

  const handleAdd = () => {
    if (exercise.trim() && duration) {
      const log: FitnessLog = {
        id: uuidv4(),
        date: selectedDate,
        exercise: exercise.trim(),
        duration: parseInt(duration),
        calories: calories ? parseInt(calories) : undefined,
        completed: false,
      };
      onUpdate([...logs, log]);
      setExercise('');
      setDuration('');
      setCalories('');
    }
  };

  const handleToggle = (id: string) => {
    onUpdate(logs.map(l => l.id === id ? { ...l, completed: !l.completed } : l));
  };

  const handleDelete = (id: string) => {
    onUpdate(logs.filter(l => l.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Fitness Tracker</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-coquette-bg rounded-lg">
          <p className="text-xs text-coquette-brown">Total Duration</p>
          <p className="text-2xl font-bold text-coquette-darkBrown">{totalDuration} min</p>
        </div>
        <div className="p-3 bg-coquette-bg rounded-lg">
          <p className="text-xs text-coquette-brown">Calories Burned</p>
          <p className="text-2xl font-bold text-coquette-darkBrown">{totalCalories}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {todayLogs.map((log) => (
          <div 
            key={log.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
              log.completed 
                ? 'bg-green-100 border-green-300' 
                : 'bg-coquette-bg border-coquette-pink/30'
            }`}
          >
            <button
              onClick={() => handleToggle(log.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                log.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-coquette-pink hover:border-coquette-rose'
              }`}
            >
              {log.completed && <Check size={16} className="text-white" />}
            </button>
            <div className="flex-1 ml-3">
              <p className={`font-medium ${log.completed ? 'line-through text-green-700' : 'text-coquette-darkBrown'}`}>
                {log.exercise}
              </p>
              <p className="text-xs text-coquette-brown">
                {log.duration} min {log.calories && `• ${log.calories} cal`}
              </p>
            </div>
            <button
              onClick={() => handleDelete(log.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise (e.g., Running)"
          className="w-full px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink text-coquette-darkBrown"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (min)"
            className="px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink text-coquette-darkBrown"
          />
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Calories (optional)"
            className="px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink text-coquette-darkBrown"
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium"
        >
          <Plus size={20} />
          Add Exercise
        </button>
      </div>

      <div className="mt-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown">
          💪 Aim for at least 30 minutes of exercise daily!
        </p>
      </div>
    </div>
  );
};

export default FitnessTracker;