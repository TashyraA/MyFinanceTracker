import { useState } from 'react';
import { TrendingDown, TrendingUp, Target, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

interface WeightGoalsTrackerProps {
  entries: WeightEntry[];
  goalWeight: number;
  onUpdateEntries: (entries: WeightEntry[]) => void;
  onUpdateGoal: (goal: number) => void;
}

const WeightGoalsTracker = ({ entries, goalWeight, onUpdateEntries, onUpdateGoal }: WeightGoalsTrackerProps) => {
  const [newWeight, setNewWeight] = useState('');
  const [newGoal, setNewGoal] = useState(goalWeight.toString());
  const [showGoalEdit, setShowGoalEdit] = useState(false);

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestEntry = sortedEntries[0];
  const previousEntry = sortedEntries[1];

  const currentWeight = latestEntry?.weight || 0;
  const weightChange = previousEntry ? currentWeight - previousEntry.weight : 0;
  const goalDifference = currentWeight - goalWeight;

  const handleAddWeight = () => {
    if (newWeight && parseFloat(newWeight) > 0) {
      const today = new Date().toISOString().split('T')[0];
      const newEntry: WeightEntry = {
        id: uuidv4(),
        date: today,
        weight: parseFloat(newWeight),
      };
      onUpdateEntries([...entries, newEntry]);
      setNewWeight('');
    }
  };

  const handleDeleteEntry = (id: string) => {
    onUpdateEntries(entries.filter(e => e.id !== id));
  };

  const handleUpdateGoal = () => {
    if (newGoal && parseFloat(newGoal) > 0) {
      onUpdateGoal(parseFloat(newGoal));
      setShowGoalEdit(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Weight Goals Tracker</h2>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-blue-600 mb-1">Current Weight</p>
          <p className="text-2xl font-bold text-blue-700">{currentWeight || '--'} lbs</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-xs text-purple-600 mb-1">Goal Weight</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-purple-700">{goalWeight} lbs</p>
            <button
              onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-purple-600 hover:text-purple-800"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className={`p-4 rounded-lg text-center ${goalDifference > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
          <p className={`text-xs mb-1 ${goalDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            To Goal
          </p>
          <div className="flex items-center justify-center gap-1">
            {goalDifference > 0 ? (
              <TrendingUp className="text-orange-600" size={20} />
            ) : (
              <TrendingDown className="text-green-600" size={20} />
            )}
            <p className={`text-2xl font-bold ${goalDifference > 0 ? 'text-orange-700' : 'text-green-700'}`}>
              {Math.abs(goalDifference).toFixed(1)} lbs
            </p>
          </div>
        </div>
      </div>

      {/* Goal Edit */}
      {showGoalEdit && (
        <div className="mb-4 p-3 bg-coquette-bg rounded-lg">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Goal weight"
              className="flex-1 px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
            />
            <button
              onClick={handleUpdateGoal}
              className="bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Recent Change */}
      {weightChange !== 0 && (
        <div className={`mb-4 p-3 rounded-lg ${weightChange < 0 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className={`text-sm ${weightChange < 0 ? 'text-green-700' : 'text-orange-700'}`}>
            {weightChange < 0 ? '🎉 Lost' : '📈 Gained'} {Math.abs(weightChange).toFixed(1)} lbs since last entry
          </p>
        </div>
      )}

      {/* Add New Weight */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWeight()}
            placeholder="Enter today's weight (lbs)"
            className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <button
            onClick={handleAddWeight}
            className="bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Log
          </button>
        </div>
      </div>

      {/* Weight History */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h3 className="text-sm font-semibold text-coquette-darkBrown mb-2">Weight History</h3>
        {sortedEntries.length > 0 ? (
          sortedEntries.map((entry, index) => {
            const prevEntry = sortedEntries[index + 1];
            const change = prevEntry ? entry.weight - prevEntry.weight : 0;
            
            return (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-coquette-bg rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-coquette-darkBrown">{entry.weight} lbs</p>
                    {change !== 0 && (
                      <span className={`text-xs ${change < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        ({change > 0 ? '+' : ''}{change.toFixed(1)})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-coquette-brown">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-coquette-brown text-center py-4">No weight entries yet. Log your first weight!</p>
        )}
      </div>
    </div>
  );
};

export default WeightGoalsTracker;
export type { WeightEntry };