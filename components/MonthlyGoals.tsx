import { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { MonthlyGoal } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface MonthlyGoalsProps {
  goals: MonthlyGoal[];
  onUpdate: (goals: MonthlyGoal[]) => void;
}

const MonthlyGoals = ({ goals, onUpdate }: MonthlyGoalsProps) => {
  const [newGoalText, setNewGoalText] = useState('');

  const handleAdd = () => {
    if (newGoalText.trim()) {
      const newGoal: MonthlyGoal = {
        id: uuidv4(),
        text: newGoalText.trim(),
        completed: false,
      };
      onUpdate([...goals, newGoal]);
      setNewGoalText('');
    }
  };

  const handleToggle = (id: string) => {
    onUpdate(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const handleDelete = (id: string) => {
    onUpdate(goals.filter(goal => goal.id !== id));
  };

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className="bg-gradient-to-br from-coquette-bg to-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg relative overflow-hidden">
      {/* Notepaper lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-8 border-b border-coquette-pink" />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-bold text-coquette-darkBrown">Monthly Goals</h2>
          </div>
          {goals.length > 0 && (
            <div className="text-sm font-medium text-coquette-brown bg-white/80 px-3 py-1 rounded-full border border-coquette-pink/30">
              {completedCount} / {goals.length} completed
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {goals.map((goal) => (
            <div 
              key={goal.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                goal.completed 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : 'bg-white/80 border-2 border-coquette-pink/30 hover:border-coquette-pink'
              }`}
            >
              <button
                onClick={() => handleToggle(goal.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                  goal.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-coquette-pink hover:border-coquette-rose'
                }`}
              >
                {goal.completed && <Check size={16} className="text-white" />}
              </button>
              <p className={`flex-1 ${goal.completed ? 'line-through text-green-700' : 'text-coquette-darkBrown'}`}>
                {goal.text}
              </p>
              <button
                onClick={() => handleDelete(goal.id)}
                className="flex-shrink-0 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a new goal for this month..."
            className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink bg-white/90 text-coquette-darkBrown placeholder:text-coquette-brown/50"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyGoals;