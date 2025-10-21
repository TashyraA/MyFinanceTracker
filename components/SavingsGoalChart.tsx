import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Edit2, Check, X } from 'lucide-react';

interface SavingsGoalChartProps {
  totalSavings: number;
  savingsGoal: number;
  onUpdateGoal: (goal: number) => void;
}

const getCssVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return val ? val.trim() : fallback;
};

const SavingsGoalChart = ({ totalSavings = 0, savingsGoal = 5000, onUpdateGoal }: SavingsGoalChartProps) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(savingsGoal.toString());

  const safeSavings = totalSavings || 0;
  const safeGoal = savingsGoal || 5000;
  
  const remaining = Math.max(0, safeGoal - safeSavings);
  const percentage = safeGoal > 0 ? ((safeSavings / safeGoal) * 100).toFixed(1) : '0';

  const data = [
    { name: 'Saved', value: safeSavings, color: getCssVar('--coquette-brown', '#8b5e3c') },
    { name: 'Remaining', value: remaining, color: getCssVar('--coquette-taupe', '#d2b48c') },
  ];

  const handleSaveGoal = () => {
    const goalValue = parseFloat(newGoal);
    if (!isNaN(goalValue) && goalValue > 0) {
      onUpdateGoal(goalValue);
      setIsEditingGoal(false);
    }
  };

  const handleCancelEdit = () => {
    setNewGoal(safeGoal.toString());
    setIsEditingGoal(false);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-rose p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-coquette-darkBrown">Savings Goal Progress</h2>
        {!isEditingGoal && (
          <button
            onClick={() => setIsEditingGoal(true)}
            className="p-2 text-coquette-brown hover:bg-coquette-cream rounded-lg transition-colors"
            title="Edit goal"
          >
            <Edit2 size={18} />
          </button>
        )}
      </div>
      
      {isEditingGoal ? (
        <div className="mb-4 p-4 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
          <label className="text-sm font-medium text-coquette-brown block mb-2">
            Set Savings Goal
          </label>
          <input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveGoal()}
            className="w-full px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel mb-3"
            placeholder="Enter goal amount"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveGoal}
              className="flex-1 bg-coquette-pastel text-white px-4 py-2 rounded-lg hover:bg-coquette-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border-2 border-coquette-taupe/30 rounded-lg hover:bg-coquette-cream transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-coquette-rose">{percentage}%</p>
            <p className="text-sm text-coquette-brown mt-1">
              ${safeSavings.toFixed(2)} of ${safeGoal.toFixed(2)}
            </p>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>

    <div className="mt-4 p-3 bg-coquette-taupe rounded-lg border-2 border-coquette-brown">
            <p className="text-sm text-coquette-darkBrown text-center">
              {remaining > 0 
                ? `$${remaining.toFixed(2)} more to reach your goal!` 
                : '🎉 Goal achieved! Consider setting a new goal.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SavingsGoalChart;