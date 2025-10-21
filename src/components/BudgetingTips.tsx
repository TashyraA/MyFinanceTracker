import { Lightbulb } from 'lucide-react';
import { FinanceData } from '@/lib/storage';

interface BudgetingTipsProps {
  financeData: FinanceData;
}

const BudgetingTips = ({ financeData }: BudgetingTipsProps) => {
  const totalExpenses = [
    ...financeData.monthlyExpenses,
    ...financeData.biweeklyExpenses,
    ...financeData.miscellaneousExpenses,
  ].reduce((sum, expense) => sum + expense.amount, 0);

  const tips = [
    {
      title: "50/30/20 Rule",
      description: "Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.",
    },
    {
      title: "Track Every Expense",
      description: "Small purchases add up. Keep track of all spending to identify areas for improvement.",
    },
    {
      title: "Build an Emergency Fund",
      description: "Aim to save 3-6 months of expenses for unexpected situations.",
    },
    {
      title: "Review Monthly",
      description: "Set aside time each month to review your spending patterns and adjust your budget.",
    },
    {
      title: "Automate Savings",
      description: "Set up automatic transfers to your savings account right after payday.",
    },
    {
      title: "Reduce Subscriptions",
      description:
        financeData.miscellaneousExpenses.length > 3
          ? "You have multiple miscellaneous expenses. Review and cancel unused subscriptions."
          : "Regularly audit your subscriptions and cancel those you don't use.",
    },
    {
      title: "Use Cash Envelopes",
      description: "Allocate cash for discretionary spending categories to avoid overspending.",
    },
    {
      title: "Meal Prep",
      description: "Planning and preparing meals in advance can save hundreds per month on food costs.",
    },
  ];

  // Cycle through background/border accents for variety
  const cardStyles = [
    "bg-coquette-cream border-coquette-taupe/40",
    "bg-coquette-pink/20 border-coquette-rose/40",
    "bg-coquette-rose/20 border-coquette-pastel/40",
    "bg-coquette-pastel/20 border-coquette-medium/40",
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Budgeting Tips</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-colors hover:shadow-md ${
              cardStyles[index % cardStyles.length]
            }`}
          >
            <h3 className="font-bold text-coquette-darkBrown mb-2">{tip.title}</h3>
            <p className="text-sm text-coquette-brown">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetingTips;
