import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Dumbbell, Clock } from 'lucide-react';
import { useDateTime } from '@/contexts/DateTimeContext';
import WorkoutTracker from '@/components/WorkoutTracker';
import MilesTracker from '@/components/MilesTracker';
import WeightGoalsTracker from '@/components/WeightGoalsTracker';
import MealPrepPlanner from '@/components/MealPrepPlanner';
import ShoppingList from '@/components/ShoppingList';
import { getFinanceData, saveFinanceData, FinanceData } from '@/lib/storage';

const Fitness = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());
  const { currentDate, currentTime } = useDateTime();

  useEffect(() => {
    saveFinanceData(financeData);
  }, [financeData]);

  const updateFinanceData = (newData: Partial<FinanceData>) => {
    setFinanceData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-bg">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-tan/30 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <div className="flex items-center gap-2">
          <Dumbbell className="text-coquette-rose" size={24} />
          <h1 className="text-2xl font-bold text-coquette-darkBrown">Fitness Planner</h1>
        </div>
        <div className="ml-auto flex items-center gap-2 text-coquette-brown">
          <Clock size={20} />
          <span className="text-sm font-medium">
            {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {currentTime}
          </span>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightGoalsTracker
              entries={financeData.weightEntries || []}
              goalWeight={financeData.weightGoal || 150}
              onUpdateEntries={(entries) => updateFinanceData({ weightEntries: entries })}
              onUpdateGoal={(goal) => updateFinanceData({ weightGoal: goal })}
            />
            <MilesTracker
              entries={financeData.milesWalked || []}
              onUpdate={(entries) => updateFinanceData({ milesWalked: entries })}
            />
          </div>

          <WorkoutTracker
            workouts={financeData.workoutDays || []}
            onUpdate={(days) => updateFinanceData({ workoutDays: days })}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MealPrepPlanner
              mealPrep={financeData.mealPrepItems || []}
              shoppingList={financeData.shoppingList || []}
              onUpdate={(items) => updateFinanceData({ mealPrepItems: items })}
              onUpdateShoppingList={(list) => updateFinanceData({ shoppingList: list })}
            />
            <ShoppingList
              items={financeData.shoppingList || []}
              onUpdate={(list) => updateFinanceData({ shoppingList: list })}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Fitness;