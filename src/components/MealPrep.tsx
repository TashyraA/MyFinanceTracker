import { useState } from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';
import { MealPlan } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface MealPrepProps {
  selectedDate: string;
  meals: MealPlan[];
  onUpdate: (meals: MealPlan[]) => void;
}

const MealPrep = ({ selectedDate, meals, onUpdate }: MealPrepProps) => {
  const [newMeal, setNewMeal] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const todayMeals = meals.filter(m => m.date === selectedDate);

  const handleAdd = () => {
    if (newMeal.trim()) {
      const meal: MealPlan = {
        id: uuidv4(),
        date: selectedDate,
        mealType,
        meal: newMeal.trim(),
      };
      onUpdate([...meals, meal]);
      setNewMeal('');
    }
  };

  const handleDelete = (id: string) => {
    onUpdate(meals.filter(m => m.id !== id));
  };

  const mealTypeColors = {
    breakfast: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    lunch: 'bg-orange-100 border-orange-300 text-orange-800',
    dinner: 'bg-purple-100 border-purple-300 text-purple-800',
    snack: 'bg-pink-100 border-pink-300 text-pink-800',
  };

  const mealTypeEmojis = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍪',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Meal Prep</h2>
      </div>

      <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
        {todayMeals.map((meal) => (
          <div 
            key={meal.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 ${mealTypeColors[meal.mealType]}`}
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xl">{mealTypeEmojis[meal.mealType]}</span>
              <div>
                <p className="text-xs font-medium uppercase">{meal.mealType}</p>
                <p className="font-medium">{meal.meal}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(meal.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value as any)}
          className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink text-coquette-darkBrown"
        >
          <option value="breakfast">🍳 Breakfast</option>
          <option value="lunch">🥗 Lunch</option>
          <option value="dinner">🍽️ Dinner</option>
          <option value="snack">🍪 Snack</option>
        </select>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="What are you eating?"
            className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink text-coquette-darkBrown"
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

      <div className="mt-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown">
          💡 Plan your meals ahead to save money and eat healthier!
        </p>
      </div>
    </div>
  );
};

export default MealPrep;