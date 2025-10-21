import { useState } from 'react';
import ExpenseBlock from './ExpenseBlock';
import { ExpenseItem } from '@/lib/storage';

interface ExpenseTrackerProps {
  monthlyExpenses: ExpenseItem[];
  biweeklyExpenses: ExpenseItem[];
  miscellaneousExpenses: ExpenseItem[];
  onUpdate: (monthly: ExpenseItem[], biweekly: ExpenseItem[], misc: ExpenseItem[]) => void;
}

const ExpenseTracker = ({ monthlyExpenses, biweeklyExpenses, miscellaneousExpenses, onUpdate }: ExpenseTrackerProps) => {
  const [selectedView, setSelectedView] = useState<'monthly' | 'biweekly' | 'miscellaneous'>('monthly');

  const handlePayExpense = (amount: number) => {
    // This is handled per expense item
  };

  const handleUnpayExpense = (amount: number) => {
    // This is handled per expense item
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedView('monthly')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedView === 'monthly' ? 'bg-coquette-pink text-white' : 'bg-coquette-bg text-coquette-brown'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedView('biweekly')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedView === 'biweekly' ? 'bg-coquette-pink text-white' : 'bg-coquette-bg text-coquette-brown'}`}
        >
          Biweekly
        </button>
        <button
          onClick={() => setSelectedView('miscellaneous')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedView === 'miscellaneous' ? 'bg-coquette-pink text-white' : 'bg-coquette-bg text-coquette-brown'}`}
        >
          Misc
        </button>
      </div>

      {selectedView === 'monthly' && (
        <ExpenseBlock
          title="Monthly Expenses"
          expenses={monthlyExpenses}
          category="monthly"
          onUpdate={(expenses) => onUpdate(expenses, biweeklyExpenses, miscellaneousExpenses)}
        />
      )}

      {selectedView === 'biweekly' && (
        <ExpenseBlock
          title="Biweekly Expenses"
          expenses={biweeklyExpenses}
          category="biweekly"
          onUpdate={(expenses) => onUpdate(monthlyExpenses, expenses, miscellaneousExpenses)}
        />
      )}

      {selectedView === 'miscellaneous' && (
        <ExpenseBlock
          title="Miscellaneous Expenses"
          expenses={miscellaneousExpenses}
          category="miscellaneous"
          onUpdate={(expenses) => onUpdate(monthlyExpenses, biweeklyExpenses, expenses)}
        />
      )}
    </div>
  );
};

export default ExpenseTracker;
