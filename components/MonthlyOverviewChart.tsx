import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyOverviewChartProps {
  income: number;
  expenses: number;
  savings: number;
}

const getCssVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return val ? val.trim() : fallback;
};

const MonthlyOverviewChart = ({ income = 0, expenses = 0 }: MonthlyOverviewChartProps) => {
  const data = [
    {
      name: 'Overview',
      Income: income || 0,
      Expenses: expenses || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <h2 className="text-xl font-bold text-coquette-darkBrown mb-4">Monthly Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={getCssVar('--coquette-taupe', '#d2b48c')} opacity={0.3} />
          <XAxis dataKey="name" stroke={getCssVar('--coquette-brown', '#8b5e3c')} />
          <YAxis stroke={getCssVar('--coquette-brown', '#8b5e3c')} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: getCssVar('--coquette-taupe', '#d2b48c'), 
              border: `2px solid ${getCssVar('--coquette-brown', '#8b5e3c')}`,
              borderRadius: '8px',
              color: getCssVar('--coquette-darkBrown', '#5c4033')
            }}
          />
          <Legend />
          <Bar dataKey="Income" fill={getCssVar('--coquette-taupe', '#d2b48c')} radius={[8, 8, 0, 0]} />
          <Bar dataKey="Expenses" fill={getCssVar('--coquette-brown', '#8b5e3c')} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyOverviewChart;