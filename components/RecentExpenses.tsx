import { Calendar, DollarSign, Tag, Trash2 } from 'lucide-react';
import { FinanceData } from '@/lib/storage';

interface RecentExpensesProps {
  financeData: FinanceData;
  onDeleteExpense?: (id: string, category: 'monthly' | 'biweekly' | 'miscellaneous') => void;
}

const RecentExpenses = ({ financeData, onDeleteExpense }: RecentExpensesProps) => {
  const allExpenses = [
    ...financeData.monthlyExpenses.map(e => ({ ...e, type: 'Monthly' })),
    ...financeData.biweeklyExpenses.map(e => ({ ...e, type: 'Bi-Weekly' })),
    ...financeData.miscellaneousExpenses.map(e => ({ ...e, type: 'Miscellaneous' })),
  ].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <h2 className="text-xl font-bold text-coquette-darkBrown mb-4">Recent Expenses</h2>
      
      {allExpenses.length > 0 ? (
        <div className="space-y-3">
          {allExpenses.map((expense) => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-4 bg-coquette-bg rounded-lg border border-coquette-pink/30 hover:border-coquette-pink transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-coquette-darkBrown">{expense.name}</h3>
                  <span className="text-xs px-2 py-1 bg-coquette-pink/20 text-coquette-brown rounded-full">
                    {expense.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-coquette-brown">
                  <div className="flex items-center gap-1">
                    <Tag size={14} />
                    <span className="font-medium">{expense.customCategory}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Due: {expense.dueDate}</span>
                  </div>
                  <span className={expense.isPaid ? 'text-green-600 font-medium' : 'text-coquette-rose'}>
                    {expense.isPaid ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-coquette-darkBrown">
                <DollarSign size={20} />
                <span className="text-xl font-bold">{expense.amount.toFixed(2)}</span>
                {onDeleteExpense && (
                  <button
                    onClick={() => onDeleteExpense(expense.id, expense.type === 'Monthly' ? 'monthly' : expense.type === 'Bi-Weekly' ? 'biweekly' : 'miscellaneous')}
                    className="ml-3 text-red-500 px-2 py-1 rounded hover:bg-red-50"
                    aria-label={`Delete expense ${expense.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-coquette-brown">
          <p>No expenses recorded yet. Start adding expenses from the Dashboard!</p>
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;