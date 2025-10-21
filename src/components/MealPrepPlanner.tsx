import { useState } from 'react';
import { Plus, Trash2, ChefHat } from 'lucide-react';
import { MealPrepItem, ShoppingListItem } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface MealPrepPlannerProps {
  mealPrep: MealPrepItem[];
  shoppingList: ShoppingListItem[];
  onUpdate: (meals: MealPrepItem[]) => void;
  onUpdateShoppingList: (list: ShoppingListItem[]) => void;
}

const MealPrepPlanner = ({ mealPrep, shoppingList, onUpdate, onUpdateShoppingList }: MealPrepPlannerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [weekStart, setWeekStart] = useState(new Date().toISOString().split('T')[0]);
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleAdd = () => {
    if (mealName && ingredients) {
      const ingredientList = ingredients.split('\n').filter(i => i.trim());
      const meal: MealPrepItem = {
        id: uuidv4(),
        weekStart,
        mealName,
        ingredients: ingredientList,
      };
      onUpdate([...mealPrep, meal]);

      // Add ingredients to shopping list
      const newShoppingItems = ingredientList.map(ingredient => ({
        id: uuidv4(),
        ingredient,
        checked: false,
      }));
      onUpdateShoppingList([...shoppingList, ...newShoppingItems]);

      setMealName('');
      setIngredients('');
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    onUpdate(mealPrep.filter(m => m.id !== id));
  };

  const getCurrentWeekMeals = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return mealPrep.filter(m => new Date(m.weekStart) >= weekAgo);
  };

  const currentWeekMeals = getCurrentWeekMeals();

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Meal Prep Plan</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-coquette-pink text-white rounded-lg hover:bg-coquette-rose transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-coquette-bg rounded-lg space-y-3">
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <input
            type="text"
            placeholder="Meal name (e.g., Chicken & Rice Bowl)"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <textarea
            placeholder="Ingredients (one per line)&#10;e.g., 2 lbs chicken breast&#10;2 cups brown rice&#10;1 lb broccoli"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <button
            onClick={handleAdd}
            className="w-full bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium"
          >
            Add Meal Prep
          </button>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currentWeekMeals.length > 0 ? (
          currentWeekMeals.map(meal => (
            <div key={meal.id} className="p-4 bg-coquette-bg rounded-lg border border-coquette-pink/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-coquette-darkBrown">{meal.mealName}</h3>
                  <p className="text-xs text-coquette-brown">
                    Week of {new Date(meal.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(meal.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium text-coquette-brown mb-1">Ingredients:</p>
                <ul className="text-xs text-coquette-brown space-y-1">
                  {meal.ingredients.map((ingredient, i) => (
                    <li key={i}>• {ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-coquette-brown">
            <p className="text-sm">No meal prep planned. Click + to add one!</p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown">
          💡 Plan your meals for the week and ingredients will automatically be added to your shopping list!
        </p>
      </div>
    </div>
  );
};

export default MealPrepPlanner;