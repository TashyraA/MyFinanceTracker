import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DateTimeProvider } from "@/contexts/DateTimeContext";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PlannerDashboard from "@/pages/PlannerDashboard";
import MonthlyPlanner from "@/pages/MonthlyPlanner";
import { useEffect } from 'react';
import Fitness from "@/pages/Fitness";
import Trends from "@/pages/Trends";
import HouseholdShopping from "@/pages/HouseholdShopping";
import History from "@/pages/History";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // placeholder for future mount logic
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DateTimeProvider>
          <BrowserRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 w-full min-w-0">
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                  
                    <Route path="/planner" element={<PlannerDashboard />} />
                    <Route path="/planner/:month" element={<MonthlyPlanner />} />
                    <Route path="/fitness" element={<Fitness />} />
                    <Route path="/trends" element={<Trends />} />
                    <Route path="/shopping" element={<HouseholdShopping />} />
                    <Route path="/history" element={<History />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </DateTimeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;