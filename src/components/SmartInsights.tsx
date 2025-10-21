import { Sparkles, RefreshCw } from 'lucide-react';
import { FinanceData, isOverdue } from '@/lib/storage';
import { useState } from 'react';

interface SmartInsightsProps {
  income: number;
  expenses: number;
  savings: number;
  debts: any[];
}

const SmartInsights = ({ income, expenses, savings, debts }: SmartInsightsProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const savingsRate = income > 0 
    ? ((savings / income) * 100).toFixed(1)
    : 0;

  const availableAfterExpenses = income - expenses;

  // Generate dynamic insights
  const generateInsights = () => {
    const insights: string[] = [];

    // Savings rate
    if (parseFloat(savingsRate.toString()) < 10) {
      insights.push(`💰 Your savings rate is ${savingsRate}%. Try to save at least 20% of your income for financial security.`);
    } else if (parseFloat(savingsRate.toString()) >= 20) {
      insights.push(`🌟 Excellent! You're saving ${savingsRate}% of your income. Keep up the great work!`);
    } else {
      insights.push(`✨ You're saving ${savingsRate}% of your income. You're on the right track!`);
    }

    // Income vs expenses
    if (expenses > income) {
      insights.push(`⚠️ Your total expenses ($${expenses.toFixed(2)}) exceed your income ($${income.toFixed(2)}). Consider cutting back on non-essential spending.`);
    } else if (availableAfterExpenses < 100) {
      insights.push(`💸 After paying all expenses, you'll have only $${availableAfterExpenses.toFixed(2)} left. Build an emergency fund for unexpected costs.`);
    } else {
      insights.push(`💚 You have $${availableAfterExpenses.toFixed(2)} available after expenses. Consider putting some into savings!`);
    }

    // Debt insights
    if (debts && debts.length > 0) {
      const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
      insights.push(`💳 You have $${totalDebt.toFixed(2)} in outstanding debt. Focus on paying this down to improve financial health.`);
    }

    return insights.slice(0, 4); // Show max 4 insights
  };

  const insights = generateInsights();

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-coquette-pink" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Smart Insights</h2>
        </div>
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="p-2 hover:bg-coquette-bg rounded-lg transition-colors"
          title="Refresh insights"
        >
          <RefreshCw className="text-coquette-brown" size={18} />
        </button>
      </div>
      <div className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={`${refreshKey}-${index}`}
              className="p-3 bg-coquette-bg rounded-lg border border-coquette-pink/30 animate-in fade-in duration-300"
            >
              <p className="text-sm text-coquette-brown leading-relaxed">{insight}</p>
            </div>
          ))
        ) : (
          <div className="p-3 bg-coquette-bg rounded-lg border border-coquette-pink/30">
            <p className="text-sm text-coquette-brown">Start adding income and expenses to get personalized insights!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartInsights;