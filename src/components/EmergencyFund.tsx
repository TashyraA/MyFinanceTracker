import { useState } from 'react';
import { Shield, Plus, Minus } from 'lucide-react';

interface EmergencyFundProps {
  totalSavings: number;
  emergencyFund: number;
  savingsGoal: number;
  emergencyFundGoal: number;
  onUpdate: (savings: number, emergency: number, savingsGoal: number, emergencyGoal: number) => void;
}

const EmergencyFund = ({ 
  totalSavings = 0, 
  emergencyFund = 0, 
  savingsGoal = 5000, 
  emergencyFundGoal = 3000, 
  onUpdate 
}: EmergencyFundProps) => {
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [newSavingsGoal, setNewSavingsGoal] = useState(savingsGoal?.toString() || '5000');
  const [newEmergencyGoal, setNewEmergencyGoal] = useState(emergencyFundGoal?.toString() || '3000');

  // Ensure values are numbers. Props might be passed as strings or undefined.
  const toNumber = (v: any, fallback = 0) => {
    const n = typeof v === 'number' ? v : parseFloat(v as any);
    return Number.isFinite(n) ? n : fallback;
  };

  const safeSavings = toNumber(totalSavings, 0);
  const safeEmergency = toNumber(emergencyFund, 0);
  const safeSavingsGoal = toNumber(savingsGoal, 5000);
  const safeEmergencyGoal = toNumber(emergencyFundGoal, 3000);

  const handleAddSavings = () => {
    if (amount) {
      onUpdate(safeSavings + parseFloat(amount), safeEmergency, safeSavingsGoal, safeEmergencyGoal);
      setAmount('');
      setShowSavingsForm(false);
    }
  };

  const handleWithdrawSavings = () => {
    if (amount) {
      onUpdate(Math.max(0, safeSavings - parseFloat(amount)), safeEmergency, safeSavingsGoal, safeEmergencyGoal);
      setAmount('');
      setShowSavingsForm(false);
    }
  };

  const handleAddEmergency = () => {
    if (amount) {
      onUpdate(safeSavings, safeEmergency + parseFloat(amount), safeSavingsGoal, safeEmergencyGoal);
      setAmount('');
      setShowEmergencyForm(false);
    }
  };

  const handleWithdrawEmergency = () => {
    if (amount) {
      onUpdate(safeSavings, Math.max(0, safeEmergency - parseFloat(amount)), safeSavingsGoal, safeEmergencyGoal);
      setAmount('');
      setShowEmergencyForm(false);
    }
  };

  const handleUpdateGoals = () => {
    onUpdate(
      safeSavings, 
      safeEmergency, 
      parseFloat(newSavingsGoal) || 5000, 
      parseFloat(newEmergencyGoal) || 3000
    );
    setShowGoalForm(false);
  };

  const savingsProgress = safeSavingsGoal > 0 ? (safeSavings / safeSavingsGoal) * 100 : 0;
  const emergencyProgress = safeEmergencyGoal > 0 ? (safeEmergency / safeEmergencyGoal) * 100 : 0;

  // Dev helper: log types/values if something unexpected happens (remove in production)
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('EmergencyFund values:', {
      totalSavings, emergencyFund, savingsGoal, emergencyFundGoal,
      safeSavings, safeEmergency, safeSavingsGoal, safeEmergencyGoal,
    });
  }

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-medium p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Savings & Emergency Fund</h2>
        </div>
        <button
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="text-sm text-coquette-brown hover:text-coquette-darkBrown underline"
        >
          Edit Goals
        </button>
      </div>

      {showGoalForm && (
        <div className="mb-4 p-4 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-coquette-brown">Savings Goal</label>
              <input
                type="number"
                value={newSavingsGoal}
                onChange={(e) => setNewSavingsGoal(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-coquette-brown">Emergency Fund Goal</label>
              <input
                type="number"
                value={newEmergencyGoal}
                onChange={(e) => setNewEmergencyGoal(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateGoals}
                className="flex-1 bg-coquette-pastel text-white px-4 py-2 rounded-lg hover:bg-coquette-medium transition-colors"
              >
                Update Goals
              </button>
              <button
                onClick={() => setShowGoalForm(false)}
                className="px-4 py-2 border-2 border-coquette-taupe/30 rounded-lg hover:bg-coquette-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-coquette-darkBrown">Savings</h3>
            <button
              onClick={() => setShowSavingsForm(!showSavingsForm)}
              className="text-sm text-coquette-brown hover:text-coquette-darkBrown"
            >
              {showSavingsForm ? 'Cancel' : 'Manage'}
            </button>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-coquette-brown">${safeSavings.toFixed(2)} / ${safeSavingsGoal.toFixed(2)}</span>
              <span className="text-coquette-brown">{savingsProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-coquette-cream rounded-full h-3 border-2 border-coquette-pink/30">
              <div 
                className="bg-coquette-rose h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(savingsProgress, 100)}%` }}
              />
            </div>
          </div>

          {showSavingsForm && (
            <div className="mt-3 p-3 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddSavings}
                  className="flex-1 bg-coquette-pastel text-white px-3 py-2 rounded-lg hover:bg-coquette-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
                <button
                  onClick={handleWithdrawSavings}
                  className="flex-1 bg-coquette-deep text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Minus size={16} /> Withdraw
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-coquette-darkBrown">Emergency Fund</h3>
            <button
              onClick={() => setShowEmergencyForm(!showEmergencyForm)}
              className="text-sm text-coquette-brown hover:text-coquette-darkBrown"
            >
              {showEmergencyForm ? 'Cancel' : 'Manage'}
            </button>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-coquette-brown">${safeEmergency.toFixed(2)} / ${safeEmergencyGoal.toFixed(2)}</span>
              <span className="text-coquette-brown">{emergencyProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-coquette-cream rounded-full h-3 border-2 border-coquette-pink/30">
              <div 
                className="bg-coquette-medium h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(emergencyProgress, 100)}%` }}
              />
            </div>
          </div>

          {showEmergencyForm && (
            <div className="mt-3 p-3 bg-coquette-cream rounded-lg border-2 border-coquette-pink/30">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-taupe/30 rounded-lg focus:outline-none focus:border-coquette-pastel mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddEmergency}
                  className="flex-1 bg-coquette-pastel text-white px-3 py-2 rounded-lg hover:bg-coquette-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
                <button
                  onClick={handleWithdrawEmergency}
                  className="flex-1 bg-coquette-deep text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Minus size={16} /> Withdraw
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyFund;