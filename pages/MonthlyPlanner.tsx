import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useDateTime } from '@/contexts/DateTimeContext';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import WeeklyPriorities from '@/components/WeeklyPriorities';
import TodoList from '@/components/TodoList';
import DailyPlannerWithRefresh from '@/components/DailyPlannerWithRefresh';
import HabitTrackerEnhanced from '@/components/HabitTrackerEnhanced';
import ShoppingList from '@/components/ShoppingList';

import { getFinanceData, saveFinanceData, FinanceData } from '@/lib/storage';

const MonthlyPlanner = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  const { currentDate, currentTime, currentDateString } = useDateTime();
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());
  const [selectedDate, setSelectedDate] = useState(currentDateString);

  useEffect(() => {
    saveFinanceData(financeData);
  }, [financeData]);

  useEffect(() => {
    setSelectedDate(currentDateString);
  }, [currentDateString]);

  const updateFinanceData = (newData: Partial<FinanceData>) => {
    setFinanceData(prev => ({
      ...prev,
      ...newData,
      monthImages: prev.monthImages, // ✅ Preserve uploaded images
    }));
  };

  const monthName = month ? month.charAt(0).toUpperCase() + month.slice(1) : '';
  const monthKey = month ? month.toLowerCase() : 'default';
  
  const validMonths = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
  
  if (!month || !validMonths.includes(month.toLowerCase())) {
    return (
      <div className="flex flex-col h-screen w-full bg-coquette-bg">
        <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-coquette-pink/30 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
          <SidebarTrigger className="text-coquette-brown" />
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-2 text-coquette-brown hover:text-coquette-darkBrown transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Planner
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-coquette-darkBrown mb-2">Invalid Month</h2>
            <p className="text-coquette-brown mb-4">Please select a valid month from the planner dashboard.</p>
            <button
              onClick={() => navigate('/planner')}
              className="bg-coquette-pink text-white px-6 py-2 rounded-lg hover:bg-coquette-rose transition-colors"
            >
              Go to Planner Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const calendarEvents = Array.isArray(financeData.calendarEvents) ? financeData.calendarEvents : [];
  const monthlyGoals = Array.isArray(financeData.monthlyGoals) ? financeData.monthlyGoals : [];
  const dailyTasks = Array.isArray(financeData.dailyTasks) ? financeData.dailyTasks : [];
  const habitTrackers = Array.isArray(financeData.habitTrackers) ? financeData.habitTrackers : [];
  // self-care removed per user request; household shopping remains

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-bg">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-coquette-pink/30 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <button
          onClick={() => navigate('/planner')}
          className="flex items-center gap-2 text-coquette-brown hover:text-coquette-darkBrown transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        {/* title removed as requested */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-coquette-brown">
            <Clock size={20} />
            <span className="text-sm font-medium">
              {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {currentTime}
            </span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <MonthlyCalendar 
            month={monthName}
            events={calendarEvents}
            onUpdate={(events) => updateFinanceData({ calendarEvents: events })}
            onDateSelect={setSelectedDate}
          />

          <WeeklyPriorities 
            events={calendarEvents}
            onUpdate={(events) => updateFinanceData({ calendarEvents: events })}
          />

          <div className="mt-4">
            {/* Household Shopping (full width) */}
            <div className="p-4 bg-white rounded-xl border-2 border-coquette-pink/30 mb-6">
              <h3 className="text-lg font-semibold text-coquette-darkBrown mb-3">Household Shopping</h3>
              <ShoppingList
                items={financeData.householdShopping && financeData.householdShopping[monthKey] ? financeData.householdShopping[monthKey] : []}
                onUpdate={(list) => {
                  const next = { ...(financeData.householdShopping || {}) };
                  next[monthKey] = list;
                  updateFinanceData({ householdShopping: next });
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodoList 
              month={monthName}
              goals={monthlyGoals}
              onUpdate={(goals) => updateFinanceData({ monthlyGoals: goals })}
            />
            <DailyPlannerWithRefresh 
              dailyTasks={dailyTasks}
              lastDate={financeData.lastDailyPlannerDate}
              onUpdate={(tasks, lastDate) => updateFinanceData({ dailyTasks: tasks, lastDailyPlannerDate: lastDate })}
            />
          </div>

          <HabitTrackerEnhanced 
            month={monthName}
            habits={habitTrackers}
            onUpdate={(habits) => updateFinanceData({ habitTrackers: habits })}
          />
        </div>
      </main>
    </div>
  );
};

export default MonthlyPlanner;
