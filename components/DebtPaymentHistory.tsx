import { DollarSign, Calendar, Trash2 } from 'lucide-react';
import { DebtPayment } from '@/lib/storage';

interface DebtPaymentHistoryProps {
  payments: DebtPayment[];
  onDeletePayment?: (id: string) => void;
}

const DebtPaymentHistory = ({ payments, onDeletePayment }: DebtPaymentHistoryProps) => {
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <h2 className="text-xl font-bold text-coquette-darkBrown mb-4">
        Debt Payment History
      </h2>

      {sortedPayments.length > 0 ? (
        <div className="space-y-3">
          {sortedPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-coquette-bg rounded-lg border border-coquette-pink/30 hover:border-coquette-pink transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-bold text-coquette-darkBrown">
                  {payment.debtName}
                </h3>
                <div className="flex items-center gap-3 text-sm text-coquette-brown mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-coquette-rose" />
                    <span>
                      {new Date(payment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-coquette-darkBrown font-medium">
                    Remaining:{' '}
                    <span className="text-coquette-deep">
                      ${payment.remainingAfter.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-coquette-darkBrown">
                <DollarSign className="text-coquette-rose" size={20} />
                <span className="text-xl font-bold text-coquette-medium">
                  -${payment.amount.toFixed(2)}
                </span>
                {onDeletePayment && (
                  <button
                    onClick={() => onDeletePayment(payment.id)}
                    className="ml-3 text-red-500 px-2 py-1 rounded hover:bg-red-50"
                    aria-label={`Delete payment ${payment.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-coquette-bg rounded-lg border border-coquette-pink/20">
          <p className="text-coquette-brown">✨ No debt payments recorded yet</p>
        </div>
      )}
    </div>
  );
};

export default DebtPaymentHistory;
