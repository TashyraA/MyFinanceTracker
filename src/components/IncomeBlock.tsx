import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, DollarSign } from 'lucide-react';
import { IncomeItem } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface IncomeBlockProps {
  income: IncomeItem[];
  totalIncome: number;
  totalSavings: number;
  emergencyFund: number;
  onUpdate: (income: IncomeItem[], totalIncome: number, totalSavings: number, emergencyFund: number) => void;
}

const IncomeBlock = ({ income = [], totalIncome = 0, totalSavings = 0, emergencyFund = 0, onUpdate }: IncomeBlockProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [editData, setEditData] = useState<any>({});

  const safeIncome = Array.isArray(income) ? income : [];
  const safeTotalIncome = totalIncome || 0;
  const safeTotalSavings = totalSavings || 0;
  const safeEmergencyFund = emergencyFund || 0;

  

  const calculateTotals = (amount: number) => {
    const available = amount * 0.75;
    const savings = amount * 0.20;
    const emergency = amount * 0.05;
    return { available, savings, emergency };
  };

  const handleAdd = () => {
    if (formData.name && formData.amount) {
      const amount = parseFloat(formData.amount);
      const { available, savings, emergency } = calculateTotals(amount);
      
      const newIncome: IncomeItem = {
        id: uuidv4(),
        name: formData.name,
        amount: available,
        date: formData.date,
        savings: savings,
        emergencyFund: emergency,
      };

      const newTotal = safeTotalIncome + available;
      const newSavings = safeTotalSavings + savings;
      const newEmergency = safeEmergencyFund + emergency;
      
      onUpdate([...safeIncome, newIncome], newTotal, newSavings, newEmergency);
      
      setFormData({ name: '', amount: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    const itemToDelete = safeIncome.find(i => i.id === id);
    if (itemToDelete) {
      const newTotal = safeTotalIncome - (itemToDelete.amount || 0);
      const newSavings = safeTotalSavings - (itemToDelete.savings || 0);
      const newEmergency = safeEmergencyFund - (itemToDelete.emergencyFund || 0);
      
      onUpdate(
        safeIncome.filter(i => i.id !== id), 
        newTotal, 
        newSavings, 
        newEmergency
      );
    }
  };

  const startEdit = (item: IncomeItem) => {
    setEditingId(item.id);
    setEditData({
      name: item.name,
      amount: item.amount?.toString() || '0',
      date: item.date,
    });
  };

  const saveEdit = (id: string) => {
    const oldItem = safeIncome.find(i => i.id === id);
    const newAmount = parseFloat(editData.amount || '0');
    
    const updatedIncome = safeIncome.map(i => 
      i.id === id ? { ...i, name: editData.name, amount: newAmount, date: editData.date } : i
    );
    
    const oldAmount = oldItem?.amount || 0;
    const oldSavings = oldItem?.savings || 0;
    const oldEmergency = oldItem?.emergencyFund || 0;
    
    const newTotal = safeTotalIncome - oldAmount + newAmount;
    const newSavings = safeTotalSavings - oldSavings + (oldItem?.savings || 0);
    const newEmergency = safeEmergencyFund - oldEmergency + (oldItem?.emergencyFund || 0);
    
    onUpdate(updatedIncome, newTotal, newSavings, newEmergency);
    setEditingId(null);
    setEditData({});
  };

  const calculatedSavings = safeIncome.reduce((sum, item) => sum + (item.savings || 0), 0);
  const calculatedEmergency = safeIncome.reduce((sum, item) => sum + (item.emergencyFund || 0), 0);

  

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="text-green-500" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Monthly Income</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-coquette-pastel text-white px-4 py-2 rounded-lg hover:bg-coquette-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Income
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
          <p className="text-sm text-coquette-brown">Available Income (75%)</p>
          <p className="text-3xl font-bold text-coquette-darkBrown">${(safeTotalIncome || 0).toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-sm text-green-700">Savings (20%)</p>
          <p className="text-3xl font-bold text-green-800">${(calculatedSavings || 0).toFixed(2)}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-blue-700">Emergency Fund (5%)</p>
          <p className="text-3xl font-bold text-blue-800">${(calculatedEmergency || 0).toFixed(2)}</p>
        </div>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Income source"
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-coquette-pastel text-white px-4 py-2 rounded-lg hover:bg-coquette-medium transition-colors"
            >
              Add
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
        {safeIncome.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
            {editingId === item.id ? (
              <div className="flex-1 grid grid-cols-3 gap-2">
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
                  value={editData.date || ''}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="px-2 py-1 border-2 border-coquette-taupe/30 rounded focus:outline-none focus:border-coquette-pastel"
                />
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-coquette-darkBrown">{item.name}</p>
                  <p className="text-sm text-coquette-brown">{item.date}</p>
                </div>
                <p className="text-lg font-bold text-green-600">${(item.amount || 0).toFixed(2)}</p>
              </>
            )}
            <div className="flex gap-2 ml-3">
              {editingId === item.id ? (
                <>
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeBlock;