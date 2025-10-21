import IncomeBlock from './IncomeBlock';
import { IncomeItem } from '@/lib/storage';

interface IncomeTrackerProps {
  income: IncomeItem[];
  totalIncome: number;
  onUpdate: (income: IncomeItem[], total: number) => void;
}

const IncomeTracker = ({ income, totalIncome, onUpdate }: IncomeTrackerProps) => {
  const totalSavings = income.reduce((sum, i) => sum + i.savings, 0);
  const emergencyFund = income.reduce((sum, i) => sum + i.emergencyFund, 0);

  const handleUpdate = (newIncome: IncomeItem[], newTotal: number, newSavings: number, newEmergency: number) => {
    onUpdate(newIncome, newTotal);
  };

  return (
    <IncomeBlock
      income={income}
      totalIncome={totalIncome}
      totalSavings={totalSavings}
      emergencyFund={emergencyFund}
      onUpdate={handleUpdate}
    />
  );
};

export default IncomeTracker;
