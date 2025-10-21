import SavingsGoalChart from './SavingsGoalChart';

interface SavingsGoalsProps {
  totalSavings: number;
  emergencyFund: number;
  savingsGoal: number;
  emergencyFundGoal: number;
  onUpdate: (savings: number, emergency: number, savingsGoal: number, emergencyGoal: number) => void;
}

const SavingsGoals = ({ totalSavings, emergencyFund, savingsGoal, emergencyFundGoal, onUpdate }: SavingsGoalsProps) => {
  return (
    <SavingsGoalChart
      totalSavings={totalSavings}
      savingsGoal={savingsGoal}
      onUpdateGoal={(goal) => onUpdate(totalSavings, emergencyFund, goal, emergencyFundGoal)}
    />
  );
};

export default SavingsGoals;
