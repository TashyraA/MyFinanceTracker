import { useState } from 'react';
import { CreditCard, Plus, DollarSign, Trash2, TrendingDown, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { DebtItem, DebtPayment, calculateDebtPayoffMonths, isDebtOverdue } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface DebtTrackerProps {
  debts: DebtItem[];
  debtPayments: DebtPayment[];
  onUpdate?: (debts: DebtItem[], payments: DebtPayment[]) => void;
  onUpdateDebts?: (debts: DebtItem[]) => void;
  onUpdatePayments?: (payments: DebtPayment[]) => void;
  onDeleteDebt?: (id: string, name: string) => void;
}

const DebtTracker = ({ debts, debtPayments, onUpdate, onUpdateDebts, onUpdatePayments, onDeleteDebt }: DebtTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentInputs, setPaymentInputs] = useState<{ [key: string]: string }>({});
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = () => {
    if (name && totalAmount && minimumPayment && dueDate) {
      const newDebt: DebtItem = {
        id: uuidv4(),
        name,
        totalAmount: parseFloat(totalAmount),
        remainingAmount: parseFloat(totalAmount),
        interestRate: parseFloat(interestRate) || 0,
        minimumPayment: parseFloat(minimumPayment),
        dueDate,
      };
      if (onUpdate) {
        onUpdate([...debts, newDebt], debtPayments);
      } else {
        onUpdateDebts?.([...debts, newDebt]);
      }
      setName('');
      setTotalAmount('');
      setInterestRate('');
      setMinimumPayment('');
      setDueDate('');
      setShowForm(false);
    }
  };

  const handlePayment = (id: string, paymentAmount: number) => {
    const debt = debts.find(d => d.id === id);
    if (debt && paymentAmount > 0) {
      const today = new Date().toISOString().split('T')[0];
      const newRemaining = Math.max(0, debt.remainingAmount - paymentAmount);
      
      // Record payment in history
      const payment: DebtPayment = {
        id: uuidv4(),
        debtId: debt.id,
        debtName: debt.name,
        amount: paymentAmount,
        date: today,
        remainingAfter: newRemaining,
      };
      
      const updatedDebts = debts.map(d => {
        if (d.id === id) {
          return { ...d, remainingAmount: newRemaining, lastPaymentDate: today };
        }
        return d;
      }).filter(d => d.remainingAmount > 0);
      
      if (onUpdate) {
        onUpdate(updatedDebts, [...debtPayments, payment]);
      } else {
        onUpdateDebts?.(updatedDebts);
        onUpdatePayments?.([...debtPayments, payment]);
      }
      setPaymentInputs({ ...paymentInputs, [id]: '' });
    }
  };

  const handleDelete = (id: string) => {
    const debtToDelete = debts.find(d => d.id === id);
    const debtName = debtToDelete?.name || '';

    const remainingDebts = debts.filter(d => d.id !== id);
    const remainingPayments = debtPayments.filter(p => p.debtId !== id);

    // If parent provided a specialized delete handler, call it and skip default callbacks
    if (onDeleteDebt) {
      onDeleteDebt(id, debtName);
      return;
    }

    if (onUpdate) {
      onUpdate(remainingDebts, remainingPayments);
    } else {
      onUpdateDebts?.(remainingDebts);
      onUpdatePayments?.(remainingPayments);
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Debt Tracker</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-coquette-pink text-white rounded-lg hover:bg-coquette-rose transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="mb-4 p-4 bg-coquette-bg rounded-lg">
        <p className="text-sm text-coquette-brown">Total Debt</p>
        <p className="text-3xl font-bold text-coquette-darkBrown">${totalDebt.toFixed(2)}</p>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-coquette-bg rounded-lg space-y-2">
          <input
            type="text"
            placeholder="Debt name (e.g., Credit Card)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <input
            type="number"
            placeholder="Total amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <input
            type="number"
            placeholder="Interest rate (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <input
            type="number"
            placeholder="Minimum payment"
            value={minimumPayment}
            onChange={(e) => setMinimumPayment(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <button
            onClick={handleAdd}
            className="w-full bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium"
          >
            Add Debt
          </button>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {debts.map((debt) => {
          const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
          const monthsToPayoff = calculateDebtPayoffMonths(debt.remainingAmount, debt.minimumPayment, debt.interestRate);
          const overdue = isDebtOverdue(debt.dueDate, debt.lastPaymentDate);

          return (
            <div 
              key={debt.id} 
              className={`p-4 rounded-lg border-2 ${
                overdue ? 'bg-red-50 border-red-400' : 'bg-coquette-bg border-coquette-pink/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {overdue && (
                    <div className="flex items-center gap-1 text-red-600 font-bold mb-1 text-sm">
                      <AlertCircle size={16} />
                      <span>PAYMENT OVERDUE</span>
                    </div>
                  )}
                  <h3 className={`font-bold ${overdue ? 'text-red-700' : 'text-coquette-darkBrown'}`}>
                    {debt.name}
                  </h3>
                  <p className="text-sm text-coquette-brown">
                    ${debt.remainingAmount.toFixed(2)} of ${debt.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-coquette-brown mt-1">
                    {debt.interestRate}% APR • Min: ${debt.minimumPayment.toFixed(2)} • Due: {debt.dueDate}
                  </p>
                  {debt.lastPaymentDate && (
                    <p className="text-xs text-green-600 mt-1">
                      Last payment: {debt.lastPaymentDate}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setPendingDelete({ id: debt.id, name: debt.name })}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full bg-white rounded-full h-2 overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-coquette-rose to-coquette-pink h-full rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-coquette-brown mb-2">
                <TrendingDown size={14} />
                <span>Payoff in ~{monthsToPayoff} months at minimum payment</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Payment amount"
                  value={paymentInputs[debt.id] || ''}
                  onChange={(e) => setPaymentInputs({ ...paymentInputs, [debt.id]: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border-2 border-coquette-pink/30 rounded focus:outline-none focus:border-coquette-pink"
                />
                <button
                  onClick={() => handlePayment(debt.id, parseFloat(paymentInputs[debt.id]) || 0)}
                  className="flex items-center gap-1 bg-coquette-pink text-white px-3 py-1 rounded text-sm hover:bg-coquette-rose transition-colors"
                >
                  <DollarSign size={14} />
                  Pay
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {debts.length === 0 && !showForm && (
        <div className="text-center py-8 text-coquette-brown">
          <p className="text-sm">No debts tracked. Click + to add one.</p>
        </div>
      )}
      {/* Confirmation dialog for deleting a debt (also removes payments/expenses) */}
      <Dialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        {pendingDelete && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete debt?</DialogTitle>
              <DialogDescription>Deleting this debt will also remove its payment history and any associated expenses. This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="px-3 py-1 border rounded bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
            <DialogClose />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DebtTracker;