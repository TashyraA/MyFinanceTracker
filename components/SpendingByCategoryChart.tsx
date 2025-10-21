import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseItem } from '@/lib/storage';

interface SpendingByCategoryChartProps {
  monthlyExpenses: ExpenseItem[];
  biweeklyExpenses: ExpenseItem[];
  miscellaneousExpenses: ExpenseItem[];
}

const getCssVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return val ? val.trim() : fallback;
};

  const COLORS = [
  getCssVar('--coquette-taupe', '#d2b48c'),
  getCssVar('--coquette-brown', '#8b5e3c'),
  getCssVar('--coquette-darkBrown', '#5c4033'),
  /* repeat pattern in case there are many categories */
  getCssVar('--coquette-taupe', '#d2b48c'),
  getCssVar('--coquette-brown', '#8b5e3c'),
];

const SpendingByCategoryChart = ({ monthlyExpenses = [], biweeklyExpenses = [], miscellaneousExpenses = [] }: SpendingByCategoryChartProps) => {
  const safeMonthly = Array.isArray(monthlyExpenses) ? monthlyExpenses : [];
  const safeBiweekly = Array.isArray(biweeklyExpenses) ? biweeklyExpenses : [];
  const safeMisc = Array.isArray(miscellaneousExpenses) ? miscellaneousExpenses : [];

  const allExpenses = [
    ...safeMonthly,
    ...safeBiweekly,
    ...safeMisc
  ];

  const categoryTotals: { [key: string]: number } = {};
  
  allExpenses.forEach(expense => {
    if (expense && expense.customCategory && expense.amount) {
      const category = expense.customCategory || 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + (expense.amount || 0);
    }
  });

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const chartHeight = Math.max(400, 300 + data.length * 10);

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pastel p-6 shadow-lg">
      <h2 className="text-xl font-bold text-coquette-darkBrown mb-6">Spending by Category</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={Math.min(chartHeight / 3, 140)}
              fill={getCssVar('--coquette-taupe', '#d2b48c')}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ 
                backgroundColor: getCssVar('--coquette-taupe', '#d2b48c'), 
                border: `2px solid ${getCssVar('--coquette-brown', '#8b5e3c')}`,
                borderRadius: '8px',
                color: getCssVar('--coquette-darkBrown', '#5c4033')
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12 text-coquette-brown">
          <p>No expenses to display. Start adding expenses to see your spending breakdown!</p>
        </div>
      )}
    </div>
  );
};

export default SpendingByCategoryChart;