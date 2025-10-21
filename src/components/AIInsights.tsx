import { Sparkles } from 'lucide-react';
import { FinanceData } from '@/lib/storage';

interface AIInsightsProps {
  financeData: FinanceData;
}

const AIInsights = ({ financeData }: AIInsightsProps) => {
  const totalExpenses = [
    ...financeData.monthlyExpenses,
    ...financeData.biweeklyExpenses,
    ...financeData.miscellaneousExpenses,
  ].reduce((sum, expense) => sum + expense.amount, 0);

  const savingsRate =
    financeData.totalIncome > 0
      ? (
          ((financeData.totalIncome - totalExpenses) /
            financeData.totalIncome) *
          100
        ).toFixed(1)
      : 0;

  const insights = [
    `Your current savings rate is ${savingsRate}%`,
    totalExpenses > financeData.totalIncome
      ? '⚠️ Your expenses exceed your income. Consider reducing discretionary spending.'
      : "✨ Great job! You're spending within your means.",
    financeData.miscellaneousExpenses.length > 5
      ? 'Consider consolidating miscellaneous expenses into fixed categories.'
      : 'Your expense tracking is well organized!',
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">AI Insights</h2>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-3 bg-coquette-cream rounded-lg border border-coquette-taupe/30"
          >
            <p className="text-sm text-coquette-brown">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
