import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { ExpenseItem, isOverdue, calculateNextDueDate } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface ExpenseBlockProps {
  title: string;
  expenses: ExpenseItem[];
  onUpdate: (expenses: ExpenseItem[]) => void;
  category: 'monthly' | 'biweekly' | 'miscellaneous';
}

const ExpenseBlock = ({ title, expenses = [], onUpdate, category }: ExpenseBlockProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    customCategory: '',
  });
  const [editData, setEditData] = useState<any>({});

  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const handleAdd = () => {
    if (formData.name && formData.amount && formData.dueDate) {
      const newExpense: ExpenseItem = {
        id: uuidv4(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        originalDueDate: formData.dueDate,
        isPaid: false,
        category: category,
        customCategory: formData.customCategory || 'General',
      };
      onUpdate([...safeExpenses, newExpense]);
      setFormData({ name: '', amount: '', dueDate: '', customCategory: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    onUpdate(safeExpenses.filter(e => e.id !== id));
  };

  const handleTogglePaid = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    onUpdate(safeExpenses.map(e => {
      if (e.id === id) {
        if (!e.isPaid) {
          return { ...e, isPaid: true, paidDate: today };
        } else {
          const nextDue = calculateNextDueDate(e.originalDueDate, category);
          return { ...e, isPaid: false, paidDate: undefined, dueDate: nextDue };
        }
      }
      return e;
    }));
  };

  const startEdit = (expense: ExpenseItem) => {
    setEditingId(expense.id);
    setEditData({
      name: expense.name,
      amount: expense.amount?.toString() || '0',
      dueDate: expense.dueDate,
      customCategory: expense.customCategory,
    });
  };

  const saveEdit = (id: string) => {
    const updatedExpenses = safeExpenses.map(e => 
      e.id === id ? { 
        ...e, 
        name: editData.name,
        amount: parseFloat(editData.amount || '0'),
        dueDate: editData.dueDate,
        customCategory: editData.customCategory,
        originalDueDate: editData.dueDate || e.originalDueDate 
      } : e
    );
    onUpdate(updatedExpenses);
    setEditingId(null);
    setEditData({});
  };

  const totalAmount = safeExpenses.reduce((sum, expense) => sum + (expense.isPaid ? 0 : (expense.amount || 0)), 0);
  const overdueCount = safeExpenses.filter(e => !e.isPaid && isOverdue(e.dueDate)).length;

  const borderColors = {
    monthly: 'border-coquette-pink',
    biweekly: 'border-coquette-rose',
    miscellaneous: 'border-coquette-pastel',
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColors[category]} p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-coquette-darkBrown">{title}</h2>
          {overdueCount > 0 && (
            <p className="text-sm text-red-600 font-medium mt-1">
              {overdueCount} overdue expense{overdueCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-coquette-brown">Total Due</p>
            <p className="text-xl font-bold text-coquette-darkBrown">${totalAmount.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-coquette-pastel text-white px-4 py-2 rounded-lg hover:bg-coquette-medium transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-coquette-cream rounded-lg border-2 border-coquette-taupe/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Expense name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
            />
            <input
              type="text"
              placeholder="Category (optional)"
              value={formData.customCategory}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
              className="px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-coquette-pastel text-white px-4 py-2 rounded-lg hover:bg-coquette-medium transition-colors"
            >
              Add Expense
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border-2 border-coquette-taupe/30 rounded-lg hover:bg-coquette-cream transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {safeExpenses.map((expense) => (
          <div 
            key={expense.id} 
            className={`p-3 rounded-lg border-2 ${
              expense.isPaid 
                ? 'bg-green-50 border-green-200' 
                : isOverdue(expense.dueDate)
                ? 'bg-red-50 border-red-200'
                : 'bg-coquette-cream border-coquette-taupe/30'
            }`}
          >
            {editingId === expense.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border-2 border-coquette-taupe/30 rounded focus:outline-none focus:border-coquette-pastel"
                  />
                  <input
                    type="number"
                    value={editData.amount || '0'}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    className="px-2 py-1 border-2 border-coquette-taupe/30 rounded focus:outline-none focus:border-coquette-pastel"
                  />
                  <input
                    type="date"
                    value={editData.dueDate || ''}
                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                    className="px-2 py-1 border-2 border-coquette-taupe/30 rounded focus:outline-none focus:border-coquette-pastel"
                  />
                  <input
                    type="text"
                    value={editData.customCategory || ''}
                    onChange={(e) => setEditData({ ...editData, customCategory: e.target.value })}
                    placeholder="Category"
                    className="px-2 py-1 border-2 border-coquette-taupe/30 rounded focus:outline-none focus:border-coquette-pastel"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(expense.id)}
                    className="flex-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Check size={16} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 border-2 border-coquette-taupe/30 rounded hover:bg-coquette-cream transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${expense.isPaid ? 'line-through text-gray-500' : 'text-coquette-darkBrown'}`}>
                      {expense.name}
                    </p>
                    {isOverdue(expense.dueDate) && !expense.isPaid && (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-coquette-brown mt-1">
                    <span className="px-2 py-0.5 bg-coquette-taupe/20 rounded-full text-xs">
                      {expense.customCategory}
                    </span>
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={14} />
                      <span>Due: {expense.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`text-lg font-bold ${expense.isPaid ? 'text-green-600' : 'text-coquette-darkBrown'}`}>
                    ${(expense.amount || 0).toFixed(2)}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTogglePaid(expense.id)}
                      className={`p-1 rounded transition-colors ${
                        expense.isPaid 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={expense.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => startEdit(expense)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {safeExpenses.length === 0 && (
          <div className="text-center py-8 text-coquette-brown">
            <p>No expenses yet. Click "Add" to create your first expense!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseBlock;