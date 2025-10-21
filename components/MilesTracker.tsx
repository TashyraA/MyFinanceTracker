import { useState } from 'react';
import { Footprints, Plus, X } from 'lucide-react';
import { MilesEntry } from '@/lib/storage';

interface MilesTrackerProps {
  entries: MilesEntry[];
  onUpdate: (entries: MilesEntry[]) => void;
}

const MilesTracker = ({ entries, onUpdate }: MilesTrackerProps) => {
  const [newMiles, setNewMiles] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);
  
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const weekTotal = last7Days.reduce((sum, date) => {
    const entry = entries.find(e => e.date === date);
    return sum + (entry?.miles || 0);
  }, 0);

  const handleAddMiles = () => {
    if (newMiles && parseFloat(newMiles) > 0) {
      const existingEntry = entries.find(e => e.date === today);
      
      if (existingEntry) {
        onUpdate(entries.map(e => 
          e.date === today 
            ? { ...e, miles: e.miles + parseFloat(newMiles) }
            : e
        ));
      } else {
        onUpdate([...entries, { date: today, miles: parseFloat(newMiles) }]);
      }
      
      setNewMiles('');
    }
  };

  const handleDeleteEntry = (date: string) => {
    onUpdate(entries.filter(e => e.date !== date));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Footprints className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Miles Walked</h2>
        </div>
      </div>

      {/* SmartWatch integration help text removed per user request */}

      {/* Today's Miles */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Today ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</p>
        <p className="text-3xl font-bold text-coquette-darkBrown">{todayEntry?.miles.toFixed(2) || '0.00'} miles</p>
      </div>

      {/* Week Total */}
      <div className="mb-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-sm text-coquette-brown">This Week Total</p>
        <p className="text-xl font-bold text-coquette-darkBrown">{weekTotal.toFixed(2)} miles</p>
      </div>

      {/* Add Miles */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={newMiles}
            onChange={(e) => setNewMiles(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMiles()}
            placeholder="Add miles walked today"
            className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
          />
          <button
            onClick={handleAddMiles}
            className="bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <h3 className="text-sm font-semibold text-coquette-darkBrown mb-2">Recent Activity</h3>
        {last7Days.map(date => {
          const entry = entries.find(e => e.date === date);
          const isToday = date === today;
          
          return (
            <div key={date} className={`flex items-center justify-between p-2 rounded-lg ${isToday ? 'bg-blue-50 border border-blue-200' : 'bg-coquette-bg'}`}>
              <div>
                <p className="text-sm font-medium text-coquette-darkBrown">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {isToday && <span className="ml-2 text-xs text-blue-600">(Today)</span>}
                </p>
                <p className="text-xs text-coquette-brown">{entry?.miles.toFixed(2) || '0.00'} miles</p>
              </div>
              {entry && (
                <button
                  onClick={() => handleDeleteEntry(date)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilesTracker;