import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { Calendar, Upload } from 'lucide-react';
import { getFinanceData, saveFinanceData, FinanceData, MonthImage } from '@/lib/storage';

const PlannerDashboard = () => {
  const navigate = useNavigate();
  const [financeData, setFinanceData] = useState<FinanceData>(getFinanceData());

  useEffect(() => {
    saveFinanceData(financeData);
  }, [financeData]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleImageUpload = (month: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const existingIndex = financeData.monthImages.findIndex(m => m.month === month);
        let updatedImages: MonthImage[];

        if (existingIndex >= 0) {
          updatedImages = financeData.monthImages.map(m =>
            m.month === month ? { ...m, imageUrl: reader.result as string } : m
          );
        } else {
          updatedImages = [...financeData.monthImages, { month, imageUrl: reader.result as string }];
        }

        setFinanceData(prev => ({ ...prev, monthImages: updatedImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getMonthImage = (month: string) => {
    return financeData.monthImages.find(m => m.month === month)?.imageUrl;
  };

  const handleMonthClick = (month: string) => {
    navigate(`/planner/${month.toLowerCase()}`);
  };

  const getCountsForMonth = (month: string) => {
    const key = month.toLowerCase();
    const hs = financeData.householdShopping && financeData.householdShopping[key] ? financeData.householdShopping[key].length : 0;
    const sc = financeData.monthlySelfCare && financeData.monthlySelfCare[key] ? financeData.monthlySelfCare[key].length : 0;
    return { hs, sc };
  };

  return (
    <div className="flex flex-col h-screen w-full bg-coquette-bg">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-coquette-pink/30 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm">
        <SidebarTrigger className="text-coquette-brown" />
        <div className="flex items-center gap-2">
          <Calendar className="text-coquette-rose" size={24} />
          <h1 className="text-2xl font-bold text-coquette-darkBrown">2025 Planner</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 p-4 bg-white rounded-lg border-2 border-coquette-pink/30">
            <p className="text-coquette-brown text-center">
              ✨ Click on any month to open your planner, or upload a custom image for each month! 📖
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {months.map((month) => {
              const monthImage = getMonthImage(month);

              return (
                <div
                  key={month}
                  onClick={() => handleMonthClick(month)}
                  className="relative group cursor-pointer bg-white rounded-xl border-2 border-coquette-pink shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square"
                >
                  {/* badges */}
                  {(() => {
                    const counts = getCountsForMonth(month);
                    return (
                      <div className="absolute top-3 left-3 z-40 flex flex-col gap-1">
                        {counts.hs > 0 && (
                          <div className="bg-coquette-rose text-white text-xs px-2 py-1 rounded">House: {counts.hs}</div>
                        )}
                        {counts.sc > 0 && (
                          <div className="bg-coquette-cream text-coquette-brown text-xs px-2 py-1 rounded">Self: {counts.sc}</div>
                        )}
                      </div>
                    );
                  })()}
                  {/* Month Image or Placeholder */}
                  <div className="absolute inset-0 z-10">
                    {monthImage ? (
                      <img
                        src={monthImage}
                        alt={month}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-coquette-bg to-coquette-cream flex items-center justify-center rounded-xl">
                        <span className="text-6xl opacity-20">📖</span>
                      </div>
                    )}
                  </div>

                 {/* Upload Icon - Bottom Right Corner */}
                  <div
                 className="absolute bottom-3 right-3 z-30"
                  onClick={(e) => e.stopPropagation()} // ✅ Prevent card click
                    >
                 <label className="flex items-center justify-center w-10 h-10 bg-coquette-pink text-white rounded-full shadow-lg hover:bg-coquette-rose transition-all cursor-pointer hover:scale-110">
                   <Upload size={20} />
                  <input
                   type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(month, e)}
                    className="hidden"
                   />
            </label>
        </div>
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-coquette-pink/0 group-hover:bg-coquette-pink/10 transition-colors duration-300 z-20" />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlannerDashboard;
