import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Utensils, DollarSign } from 'lucide-react';
import { AIInsight, generateDailyInsights } from '@/lib/storage';

interface AIInsightsDashboardProps {
  insights: AIInsight[];
  onUpdate: (insights: AIInsight[]) => void;
}

const AIInsightsDashboard = ({ insights, onUpdate }: AIInsightsDashboardProps) => {
  const [todaysInsight, setTodaysInsight] = useState<AIInsight | null>(null);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let currentInsight = insights.find(i => i.date === today);
    
    if (!currentInsight) {
      // Generate new insights for today
      currentInsight = generateDailyInsights();
      onUpdate([...insights.slice(-6), currentInsight]); // Keep last 7 days
    }
    
    setTodaysInsight(currentInsight);
  }, []);

  if (!todaysInsight) return null;

  return (
    <div className="bg-gradient-to-br from-white to-coquette-bg rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-coquette-rose animate-pulse" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">AI Daily Insights</h2>
        <span className="text-xs text-coquette-brown ml-auto">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="space-y-3">
        {/* Finance Tip */}
        <div className="p-4 bg-coquette-cream rounded-lg border border-coquette-taupe/40">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-coquette-deep" size={20} />
            <h3 className="font-semibold text-coquette-darkBrown">Finance Tip</h3>
          </div>
          <p className="text-sm text-coquette-brown">{todaysInsight.financeTip}</p>
        </div>

        {/* Fitness Tip */}
        <div className="p-4 bg-coquette-pink/20 rounded-lg border border-coquette-rose/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-coquette-medium" size={20} />
            <h3 className="font-semibold text-coquette-darkBrown">Fitness Tip</h3>
          </div>
          <p className="text-sm text-coquette-brown">{todaysInsight.fitnessTip}</p>
        </div>

        {/* Meal Tip */}
        <div className="p-4 bg-coquette-rose/20 rounded-lg border border-coquette-pastel/50">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="text-coquette-pastel" size={20} />
            <h3 className="font-semibold text-coquette-darkBrown">Meal Tip</h3>
          </div>
          <p className="text-sm text-coquette-brown">{todaysInsight.mealTip}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-center text-coquette-brown">
        ✨ New personalized insights generated daily based on your goals
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
