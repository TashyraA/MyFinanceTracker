import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DateTimeContextType {
  currentDate: Date;
  currentDateString: string;
  currentTime: string;
  isToday: (date: string) => boolean;
}

const DateTimeContext = createContext<DateTimeContextType | undefined>(undefined);

export const DateTimeProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update every second for real-time clock
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentDateString = currentDate.toISOString().split('T')[0];
  const currentTime = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const isToday = (date: string) => {
    return date === currentDateString;
  };

  return (
    <DateTimeContext.Provider value={{ currentDate, currentDateString, currentTime, isToday }}>
      {children}
    </DateTimeContext.Provider>
  );
};

export const useDateTime = () => {
  const context = useContext(DateTimeContext);
  if (!context) {
    throw new Error('useDateTime must be used within DateTimeProvider');
  }
  return context;
};