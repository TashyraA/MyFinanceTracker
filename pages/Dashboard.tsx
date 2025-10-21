import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DollarSign, TrendingUp, AlertCircle, PiggyBank, Clock } from 'lucide-react';
import { useDateTime } from '@/contexts/DateTimeContext';
import IncomeBlock from '@/components/IncomeBlock';
import ExpenseBlock from '@/components/ExpenseBlock';
import EmergencyFund from '@/components/EmergencyFund';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import DebtTracker from '@/components/DebtTracker';
import MonthlyGoals from '@/components/MonthlyGoals';
import MonthlyOverviewChart from '@/components/MonthlyOverviewChart';
import SmartInsights from '@/components/SmartInsights';
import { getFinanceData, saveFinanceData, FinanceData } from '@/lib/storage';

const Dashboard = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());
  const { currentDate, currentTime } = useDateTime();

  useEffect(() => {
    saveFinanceData(financeData);
  }, [financeData]);

  const updateFinanceData = (newData: Partial<FinanceData>) => {
    setFinanceData(prev => ({ ...prev, ...newData }));
  };

  const totalExpenses = 
    (financeData.monthlyExpenses || []).reduce((sum, e) => sum + e.amount, 0) +
    (financeData.biweeklyExpenses || []).reduce((sum, e) => sum + e.amount, 0) +
    (financeData.miscellaneousExpenses || []).reduce((sum, e) => sum + e.amount, 0);

  // Compute total income from the monthlyIncome array to avoid relying on a possibly stale
  // persisted `totalIncome` value in localStorage.
  const computedTotalIncome = (financeData.monthlyIncome || []).reduce((sum, i) => sum + (i.amount || 0), 0);
  const computedSavings = (financeData.monthlyIncome || []).reduce((sum, i) => sum + (i.savings || 0), 0);
  const remainingIncome = computedTotalIncome - totalExpenses;
  // Sum of minimum monthly debt payments to reserve from remaining income
  const totalMinimumDebtPayments = (financeData.debts || []).reduce((sum, d) => sum + (d.minimumPayment || 0), 0);
  // Sum of actual debt payments already made this period — these should reduce the remaining available balance.
  const totalDebtPaymentsMade = (financeData.debtPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  // Remaining after reserving minimum payments and subtracting actual payments made.
  const remainingAfterDebt = remainingIncome - totalMinimumDebtPayments - totalDebtPaymentsMade;
  const totalDebt = (financeData.debts || []).reduce((sum, d) => sum + d.remainingAmount, 0);

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-cream">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b-2 border-coquette-taupe/30 bg-white/90 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <div className="flex items-center gap-2">
          <DollarSign className="text-coquette-rose" size={24} />
          <h1 className="text-2xl font-bold text-coquette-darkBrown">Finance Tracker</h1>
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-500" size={20} />
                <p className="text-sm text-coquette-brown">Total Income</p>
              </div>
              <p className="text-2xl font-bold text-coquette-darkBrown">${computedTotalIncome.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-coquette-rose p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-sm text-coquette-brown">Total Expenses</p>
              </div>
              <p className="text-2xl font-bold text-coquette-darkBrown">${totalExpenses.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-coquette-pastel p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="text-blue-500" size={20} />
                <p className="text-sm text-coquette-brown">Remaining</p>
              </div>
              <p className={`text-2xl font-bold ${remainingAfterDebt >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remainingAfterDebt.toFixed(2)}
              </p>
              
            </div>

            <div className="bg-white rounded-xl border-2 border-coquette-medium p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-orange-500" size={20} />
                <p className="text-sm text-coquette-brown">Total Debt</p>
              </div>
              <p className="text-2xl font-bold text-coquette-darkBrown">${totalDebt.toFixed(2)}</p>
            </div>
          </div>

          {/* Monthly Overview Chart and Smart Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MonthlyOverviewChart
                income={computedTotalIncome}
                expenses={totalExpenses}
                savings={computedSavings}
              />
            </div>
            <div>
              <SmartInsights
                income={computedTotalIncome}
                expenses={totalExpenses}
                savings={computedSavings}
                debts={financeData.debts || []}
              />
            </div>
          </div>

          {/* Monthly Goals */}
          <MonthlyGoals
            goals={financeData.monthlyGoals || []}
            onUpdate={(goals) => updateFinanceData({ monthlyGoals: goals })}
          />

          {/* Emergency Fund and Debt Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary>
              <EmergencyFund
                totalSavings={financeData.totalSavings || 0}
                emergencyFund={financeData.emergencyFund || 0}
                savingsGoal={financeData.savingsGoal || 5000}
                emergencyFundGoal={financeData.emergencyFundGoal || 3000}
                onUpdate={(savings, emergency, savingsGoal, emergencyGoal) =>
                  updateFinanceData({
                    totalSavings: savings,
                    emergencyFund: emergency,
                    savingsGoal: savingsGoal,
                    emergencyFundGoal: emergencyGoal,
                  })
                }
              />
            </ErrorBoundary>
            <DebtTracker
              debts={financeData.debts || []}
              debtPayments={financeData.debtPayments || []}
              onUpdateDebts={(debts) => updateFinanceData({ debts })}
              onUpdatePayments={(payments) => updateFinanceData({ debtPayments: payments })}
              onDeleteDebt={(id, name) => {
                // When deleting a debt, also remove related debtPayments and any expenses
                // that reference the debt by name or customCategory.
                // NOTE: ExpenseItem does not have a debtId field in the current schema,
                // so we match by name as a reasonable assumption.
                const remainingDebts = (financeData.debts || []).filter(d => d.id !== id);
                const remainingPayments = (financeData.debtPayments || []).filter(p => p.debtId !== id);

                const filterExpenses = (arr = []) => arr.filter(e => e.name !== name && e.customCategory !== name);

                const monthlyExpenses = filterExpenses(financeData.monthlyExpenses || []);
                const biweeklyExpenses = filterExpenses(financeData.biweeklyExpenses || []);
                const miscellaneousExpenses = filterExpenses(financeData.miscellaneousExpenses || []);

                updateFinanceData({
                  debts: remainingDebts,
                  debtPayments: remainingPayments,
                  monthlyExpenses,
                  biweeklyExpenses,
                  miscellaneousExpenses,
                });
              }}
            />
          </div>

          {/* Income Block */}
          <IncomeBlock
            income={financeData.monthlyIncome || []}
            totalIncome={financeData.totalIncome || 0}
            totalSavings={financeData.totalSavings || 0}
            emergencyFund={financeData.emergencyFund || 0}
            onUpdate={(income, total, savings, emergency) => 
              updateFinanceData({ 
                monthlyIncome: income, 
                totalIncome: total,
                totalSavings: savings,
                emergencyFund: emergency
              })
            }
          />

          {/* Separate Expense Blocks */}
          <ExpenseBlock
            title="Monthly Expenses"
            expenses={financeData.monthlyExpenses || []}
            onUpdate={(expenses) => updateFinanceData({ monthlyExpenses: expenses })}
            category="monthly"
          />

          <ExpenseBlock
            title="Bi-Weekly Expenses"
            expenses={financeData.biweeklyExpenses || []}
            onUpdate={(expenses) => updateFinanceData({ biweeklyExpenses: expenses })}
            category="biweekly"
          />

          <ExpenseBlock
            title="Miscellaneous Expenses"
            expenses={financeData.miscellaneousExpenses || []}
            onUpdate={(expenses) => updateFinanceData({ miscellaneousExpenses: expenses })}
            category="miscellaneous"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;