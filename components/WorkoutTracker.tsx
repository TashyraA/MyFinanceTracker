import { useState } from 'react';
import { Plus, Check, Trash2, Dumbbell } from 'lucide-react';
import { WorkoutDay, getCurrentWeekDates } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface WorkoutTrackerProps {
  workouts: WorkoutDay[];
  onUpdate: (workouts: WorkoutDay[]) => void;
}

const WorkoutTracker = ({ workouts, onUpdate }: WorkoutTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutType, setWorkoutType] = useState<'upper' | 'lower' | 'cardio' | 'rest'>('upper');
  const [exercises, setExercises] = useState('');

  const weekDates = getCurrentWeekDates();

  const handleAdd = () => {
    if (selectedDate && exercises) {
      const workout: WorkoutDay = {
        id: uuidv4(),
        date: selectedDate,
        type: workoutType,
        exercises: exercises.split('\n').filter(e => e.trim()),
        completed: false,
      };
      onUpdate([...workouts, workout]);
      setExercises('');
      setShowForm(false);
    }
  };

  const handleToggle = (id: string) => {
    onUpdate(workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const handleDelete = (id: string) => {
    onUpdate(workouts.filter(w => w.id !== id));
  };

  const getWorkoutForDate = (date: string) => {
    return workouts.find(w => w.date === date);
  };

  const workoutTypeColors = {
    upper: 'bg-blue-100 text-blue-700 border-blue-300',
    lower: 'bg-purple-100 text-purple-700 border-purple-300',
    cardio: 'bg-orange-100 text-orange-700 border-orange-300',
    rest: 'bg-green-100 text-green-700 border-green-300',
  };

  const workoutTypeLabels = {
    upper: '💪 Upper Body',
    lower: '🦵 Lower Body',
    cardio: '🏃 Cardio',
    rest: '😴 Rest Day',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Weekly Workout Plan</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Workout
        </button>
      </div>

      <div className="mb-3 p-2 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown text-center">
          Week of {new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-coquette-bg rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-coquette-darkBrown">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-coquette-darkBrown">Workout Type</label>
              <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value as any)}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              >
                <option value="upper">💪 Upper Body</option>
                <option value="lower">🦵 Lower Body</option>
                <option value="cardio">🏃 Cardio</option>
                <option value="rest">😴 Rest Day</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-coquette-darkBrown">Exercises (one per line)</label>
              <textarea
                value={exercises}
                onChange={(e) => setExercises(e.target.value)}
                placeholder="Bench Press&#10;Push-ups&#10;Shoulder Press"
                rows={4}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors"
              >
                Add Workout
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border-2 border-coquette-pink/30 rounded-lg hover:bg-coquette-bg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDates.map((date, index) => {
          const workout = getWorkoutForDate(date);
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const isToday = date === new Date().toISOString().split('T')[0];

          return (
            <div
              key={date}
              className={`p-3 rounded-lg border-2 ${
                isToday ? 'border-coquette-pink bg-coquette-bg' : 'border-coquette-pink/30 bg-white'
              }`}
            >
              <div className="text-center mb-2">
                <p className="text-xs text-coquette-brown">{dayNames[index]}</p>
                <p className="text-lg font-bold text-coquette-darkBrown">
                  {new Date(date).getDate()}
                </p>
              </div>

              {workout ? (
                <div className="space-y-2">
                  <div className={`text-xs px-2 py-1 rounded border ${workoutTypeColors[workout.type]} text-center`}>
                    {workoutTypeLabels[workout.type]}
                  </div>
                  {workout.exercises.length > 0 && (
                    <div className="text-xs text-coquette-brown">
                      {workout.exercises.slice(0, 2).map((ex, i) => (
                        <div key={i}>• {ex}</div>
                      ))}
                      {workout.exercises.length > 2 && (
                        <div className="text-coquette-brown/60">+{workout.exercises.length - 2} more</div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggle(workout.id)}
                      className={`flex-1 p-1 rounded text-xs transition-colors ${
                        workout.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {workout.completed ? <Check size={12} className="mx-auto" /> : 'Mark'}
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-coquette-brown/50 py-2">
                  No workout
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutTracker;