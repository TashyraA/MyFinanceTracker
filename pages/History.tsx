import { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { History as HistoryIcon } from 'lucide-react';
import RecentExpenses from '@/components/RecentExpenses';
import DebtPaymentHistory from '@/components/DebtPaymentHistory';
import { getFinanceData, saveFinanceData, FinanceData } from '@/lib/storage';

const History = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());

  const persist = (data: FinanceData) => {
    setFinanceData(data);
    saveFinanceData(data);
  };

  const handleDeleteExpense = (id: string, category: 'monthly' | 'biweekly' | 'miscellaneous') => {
    const monthlyExpenses = category === 'monthly' ? (financeData.monthlyExpenses || []).filter(e => e.id !== id) : financeData.monthlyExpenses || [];
    const biweeklyExpenses = category === 'biweekly' ? (financeData.biweeklyExpenses || []).filter(e => e.id !== id) : financeData.biweeklyExpenses || [];
    const miscellaneousExpenses = category === 'miscellaneous' ? (financeData.miscellaneousExpenses || []).filter(e => e.id !== id) : financeData.miscellaneousExpenses || [];

    persist({ ...financeData, monthlyExpenses, biweeklyExpenses, miscellaneousExpenses });
  };

  const handleDeleteDebtPayment = (id: string) => {
    const debtPayments = (financeData.debtPayments || []).filter(p => p.id !== id);
    persist({ ...financeData, debtPayments });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-bg">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-tan/30 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <div className="flex items-center gap-2">
          <HistoryIcon className="text-coquette-rose" size={24} />
          <h1 className="text-2xl font-bold text-coquette-darkBrown">History</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <RecentExpenses
            financeData={financeData}
            onDeleteExpense={handleDeleteExpense}
          />
          <DebtPaymentHistory
            payments={financeData.debtPayments || []}
            onDeletePayment={handleDeleteDebtPayment}
          />
        </div>
      </main>
    </div>
  );
};

export default History;