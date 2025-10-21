import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TrendingUp } from 'lucide-react';
import SavingsGoalChart from '@/components/SavingsGoalChart';
import SpendingByCategoryChart from '@/components/SpendingByCategoryChart';
import BudgetingTips from '@/components/BudgetingTips';
import { getFinanceData, saveFinanceData, FinanceData } from '@/lib/storage';

const Trends = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());

  useEffect(() => {
    saveFinanceData(financeData);
  }, [financeData]);

  const updateSavingsGoal = (goal: number) => {
    const updatedData = { ...financeData, savingsGoal: goal };
    setFinanceData(updatedData);
    saveFinanceData(updatedData);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-cream">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b-2 border-coquette-taupe/30 bg-white/90 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <div className="flex items-center gap-2">
          <TrendingUp className="text-coquette-rose" size={24} />
          <h1 className="text-2xl font-bold text-coquette-darkBrown">Trends & Insights</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SavingsGoalChart
              totalSavings={financeData.totalSavings || 0}
              savingsGoal={financeData.savingsGoal || 5000}
              onUpdateGoal={updateSavingsGoal}
            />
            <SpendingByCategoryChart
              monthlyExpenses={financeData.monthlyExpenses || []}
              biweeklyExpenses={financeData.biweeklyExpenses || []}
              miscellaneousExpenses={financeData.miscellaneousExpenses || []}
            />
          </div>

          <BudgetingTips financeData={financeData} />
        </div>
      </main>
    </div>
  );
};

export default Trends;