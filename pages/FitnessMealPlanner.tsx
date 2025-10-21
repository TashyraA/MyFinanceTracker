import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import WorkoutTracker from '@/components/WorkoutTracker';
import MilesTracker from '@/components/MilesTracker';
import MealPrepPlanner from '@/components/MealPrepPlanner';
import ShoppingList from '@/components/ShoppingList';
import MealPlanGenerator from '@/components/MealPlanGenerator';
import { getFinanceData, saveFinanceData, FinanceData } from '@/lib/storage';

const FitnessMealPlanner = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());

  useEffect(() => {
    saveFinanceData(financeData);
  }, [financeData]);

  const updateFinanceData = (newData: Partial<FinanceData>) => {
    setFinanceData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-bg">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-coquette-pink/30 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">💪</span>
          <h1 className="text-2xl font-bold text-coquette-darkBrown">Fitness & Meal Planner</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Fitness Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WorkoutTracker 
                workouts={financeData.workoutDays}
                onUpdate={(workouts) => updateFinanceData({ workoutDays: workouts })}
              />
            </div>
            <div>
              <MilesTracker 
                entries={financeData.milesWalked}
                onUpdate={(miles) => updateFinanceData({ milesWalked: miles })}
              />
            </div>
          </div>

          {/* Meal Planning Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MealPrepPlanner 
              mealPrep={financeData.mealPrepItems}
              onUpdate={(meals) => updateFinanceData({ mealPrepItems: meals })}
              onUpdateShoppingList={(list) => updateFinanceData({ shoppingList: list })}
              shoppingList={financeData.shoppingList}
            />
            <ShoppingList 
              items={financeData.shoppingList}
              onUpdate={(list) => updateFinanceData({ shoppingList: list })}
            />
          </div>

          {/* AI Meal Plan Generator */}
          <MealPlanGenerator 
            profile={financeData.fitnessProfile}
            generatedPlan={financeData.generatedMealPlan}
            shoppingList={financeData.shoppingList}
            onUpdateProfile={(profile) => updateFinanceData({ fitnessProfile: profile })}
            onUpdatePlan={(plan) => updateFinanceData({ generatedMealPlan: plan })}
            onAcceptPlan={(meals) => updateFinanceData({ mealPrepItems: [...financeData.mealPrepItems, ...meals] })}
            onUpdateShoppingList={(list) => updateFinanceData({ shoppingList: list })}
          />
        </div>
      </main>
    </div>
  );
};

export default FitnessMealPlanner;