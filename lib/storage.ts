export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  originalDueDate: string;
  isPaid: boolean;
  paidDate?: string;
  category: 'monthly' | 'biweekly' | 'miscellaneous';
  customCategory: string;
}

export interface IncomeItem {
  id: string;
  name: string;
  amount: number;
  date: string;
  savings: number;
  emergencyFund: number;
}

export interface DebtItem {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  lastPaymentDate?: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  debtName: string;
  amount: number;
  date: string;
  remainingAfter: number;
}

export interface MonthlyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  month: string;
  date: string;
  title: string;
  time?: string;
  description?: string;
}

export interface DailyTask {
  id: string;
  date: string;
  time: string;
  task: string;
}

export interface HabitTracker {
  id: string;
  month: string;
  habit: string;
  completedDates: string[];
}

export interface MonthImage {
  month: string;
  imageUrl: string;
}

export interface CustomSticker {
  id: string;
  imageUrl: string;
  name: string;
  fileType: 'png' | 'svg';
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  locked?: boolean;
  month: string;
}

export interface WorkoutDay {
  id: string;
  date: string;
  type: 'upper' | 'lower' | 'cardio' | 'rest';
  exercises: string[];
  completed: boolean;
}

export interface MealPrepItem {
  id: string;
  weekStart: string;
  mealName: string;
  ingredients: string[];
}

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  checked: boolean;
}

export interface FitnessProfile {
  weight: number;
  height: string;
  age: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}

export interface AIInsight {
  id: string;
  date: string;
  financeTip: string;
  fitnessTip: string;
  mealTip: string;
}

export interface PlannerTask {
  id: string;
  date: string;
  text: string;
  time?: string;
  completed: boolean;
}

export interface FitnessLog {
  id: string;
  date: string;
  exercise: string;
  duration: number;
  calories?: number;
  completed: boolean;
}

export interface MealPlan {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal: string;
}

export interface GeneratedMealPlan {
  generatedDate: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
  calories: number;
  ingredients: string[];
  tip?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface MilesEntry {
  date: string;
  miles: number;
}

export interface SelfCareItem {
  id: string;
  category: 'skincare' | 'haircare' | 'grooming' | 'makeup' | 'other';
  title: string;
  notes?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'one-time';
  recurring?: boolean;
  nextDue?: string; // ISO date
  linkedShoppingItems?: string[]; // ingredient strings to add to shopping list
  completed?: boolean;
}

export interface FinanceData {
  monthlyIncome: IncomeItem[];
  monthlyExpenses: ExpenseItem[];
  biweeklyExpenses: ExpenseItem[];
  miscellaneousExpenses: ExpenseItem[];
  totalIncome: number;
  totalSavings: number;
  emergencyFund: number;
  savingsGoal: number;
  emergencyFundGoal: number;
  // Manual override locks for savings/emergency editing
  
  monthlyGoals: MonthlyGoal[];
  debts: DebtItem[];
  debtPayments: DebtPayment[];
  calendarEvents: CalendarEvent[];
  dailyTasks: DailyTask[];
  habitTrackers: HabitTracker[];
  monthImages: MonthImage[];
  customStickers: CustomSticker[];
  placedStickers: PlacedSticker[];
  workoutDays: WorkoutDay[];
  milesWalked: MilesEntry[];
  mealPrepItems: MealPrepItem[];
  shoppingList: ShoppingListItem[];
  fitnessProfile?: FitnessProfile;
  weightEntries: WeightEntry[];
  weightGoal: number;
  lastDailyPlannerDate?: string;
  aiInsights?: AIInsight[];
  plannerTasks?: PlannerTask[];
  fitnessLogs?: FitnessLog[];
  mealPlans?: MealPlan[];
  generatedMealPlan?: GeneratedMealPlan;
  selfCareItems?: SelfCareItem[];
  householdShopping?: { [month: string]: ShoppingListItem[] };
  monthlySelfCare?: { [month: string]: {
    id: string;
    type: string;
    date: string;
    completed: boolean;
    linkedShoppingItems?: string[];
  }[] };
  monthlyPersonalCare?: { [month: string]: ShoppingListItem[] };
  monthlySavingsGoals?: { [month: string]: { savingsGoal: number; emergencyFundGoal: number } };
}

const STORAGE_KEY = 'coquette-finance-data';

export const getFinanceData = (): FinanceData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data) as Partial<FinanceData>;

      // Helper to coerce number fields safely
      const toNum = (v: any, fallback = 0) => {
        const n = typeof v === 'number' ? v : parseFloat(v as any);
        return Number.isFinite(n) ? n : fallback;
      };

      // Normalize monthlyIncome entries
      const monthlyIncome = (parsed.monthlyIncome || []).map(i => ({
        id: i.id,
        name: i.name,
        amount: toNum((i as any).amount, 0),
        date: i.date,
        savings: toNum((i as any).savings, 0),
        emergencyFund: toNum((i as any).emergencyFund, 0),
      })).filter(i => Number.isFinite(i.amount));

      // Normalize expenses lists (ensure numeric amounts)
      const normalizeExpenses = (arr: any[] = []) => (arr || []).map(e => ({
        ...e,
        amount: toNum(e.amount, 0),
      })).filter(e => e && typeof e.id === 'string');

      const monthlyExpenses = normalizeExpenses(parsed.monthlyExpenses as any[]);
      const biweeklyExpenses = normalizeExpenses(parsed.biweeklyExpenses as any[]);
      const miscellaneousExpenses = normalizeExpenses(parsed.miscellaneousExpenses as any[]);

      // Normalize debts and payments
      const debts = (parsed.debts || []).map((d: any) => ({
        ...d,
        totalAmount: toNum(d.totalAmount, 0),
        remainingAmount: toNum(d.remainingAmount, 0),
        interestRate: toNum(d.interestRate, 0),
        minimumPayment: toNum(d.minimumPayment, 0),
      }));

      const debtPayments = (parsed.debtPayments || []).map((p: any) => ({
        ...p,
        amount: toNum(p.amount, 0),
        remainingAfter: toNum(p.remainingAfter, 0),
      }));

      const totalIncome = monthlyIncome.reduce((s, i) => s + (i.amount || 0), 0);

      // Normalize placed stickers to ensure numeric fields and optional locked flag
      const placedStickers = (parsed.placedStickers || []).map((p: any) => ({
        id: p.id,
        stickerId: p.stickerId,
        src: p.src,
        x: toNum(p.x, 0),
        y: toNum(p.y, 0),
        scale: toNum(p.scale, 1),
        rotation: toNum(p.rotation, 0),
        zIndex: toNum(p.zIndex, 0),
        locked: !!p.locked,
        month: p.month,
      })).filter((p: any) => p && typeof p.id === 'string');

      const normalized: FinanceData = {
        monthlyIncome,
        monthlyExpenses,
        biweeklyExpenses,
        miscellaneousExpenses,
        totalIncome,
        totalSavings: toNum(parsed.totalSavings, 0),
        emergencyFund: toNum(parsed.emergencyFund, 0),
        savingsGoal: toNum(parsed.savingsGoal, 5000),
        emergencyFundGoal: toNum(parsed.emergencyFundGoal, 3000),
        monthlyGoals: parsed.monthlyGoals || [],
        debts,
        debtPayments,
        calendarEvents: parsed.calendarEvents || [],
        dailyTasks: parsed.dailyTasks || [],
        habitTrackers: parsed.habitTrackers || [],
        monthImages: parsed.monthImages || [],
        customStickers: parsed.customStickers || [],
        placedStickers,
        workoutDays: parsed.workoutDays || [],
        milesWalked: parsed.milesWalked || [],
        mealPrepItems: parsed.mealPrepItems || [],
        shoppingList: parsed.shoppingList || [],
        weightEntries: parsed.weightEntries || [],
        weightGoal: toNum(parsed.weightGoal, 150),
        lastDailyPlannerDate: parsed.lastDailyPlannerDate,
        aiInsights: parsed.aiInsights || [],
        plannerTasks: parsed.plannerTasks || [],
        fitnessLogs: parsed.fitnessLogs || [],
        mealPlans: parsed.mealPlans || [],
        generatedMealPlan: parsed.generatedMealPlan,
        selfCareItems: parsed.selfCareItems || [],
        householdShopping: parsed.householdShopping || {},
        monthlySelfCare: parsed.monthlySelfCare || {},
  monthlyPersonalCare: parsed.monthlyPersonalCare || {},
  monthlySavingsGoals: parsed.monthlySavingsGoals || {},
      };

      // Ensure monthly savings goals are seeded for the current month and
      // override top-level goals with the month's values so goals recur month-by-month.
      try {
        const now = new Date();
        const monthKeyNow = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
        if (!normalized.monthlySavingsGoals) normalized.monthlySavingsGoals = {};
        if (normalized.monthlySavingsGoals[monthKeyNow]) {
          const mg = normalized.monthlySavingsGoals[monthKeyNow];
          normalized.savingsGoal = typeof mg.savingsGoal === 'number' ? mg.savingsGoal : normalized.savingsGoal;
          normalized.emergencyFundGoal = typeof mg.emergencyFundGoal === 'number' ? mg.emergencyFundGoal : normalized.emergencyFundGoal;
        } else {
          // Seed this month's goals from the top-level defaults so it's recurring
          normalized.monthlySavingsGoals[monthKeyNow] = {
            savingsGoal: normalized.savingsGoal,
            emergencyFundGoal: normalized.emergencyFundGoal,
          };
        }

        // Persist normalized object back to storage to clear stale values
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (e) {
        // ignore write errors
      }

      return normalized;
    } catch (err) {
      console.error('Failed to parse finance data from storage, using defaults.', err);
      // Fallthrough to defaults below
    }
  }
  return {
    monthlyIncome: [],
    monthlyExpenses: [],
    biweeklyExpenses: [],
    miscellaneousExpenses: [],
    totalIncome: 0,
    totalSavings: 0,
    emergencyFund: 0,
    savingsGoal: 5000,
    emergencyFundGoal: 3000,
    
    monthlyGoals: [],
    debts: [],
    debtPayments: [],
    calendarEvents: [],
    dailyTasks: [],
    habitTrackers: [],
    monthImages: [],
    customStickers: [],
    placedStickers: [],
    workoutDays: [],
    milesWalked: [],
    mealPrepItems: [],
    shoppingList: [],
    householdShopping: {},
  monthlySelfCare: {},
  monthlyPersonalCare: {},
  monthlySavingsGoals: {},
    weightEntries: [],
    weightGoal: 150,
    selfCareItems: [],
  };
};

export const saveFinanceData = (data: FinanceData): void => {
  try {
    // ensure monthlySavingsGoals is updated for the current month so goals recur
    const now = new Date();
    const monthKeyNow = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const monthlyGoalsMap = { ...(data.monthlySavingsGoals || {}) };
    monthlyGoalsMap[monthKeyNow] = {
      savingsGoal: data.savingsGoal,
      emergencyFundGoal: data.emergencyFundGoal,
    };

    const limitedData = {
      ...data,
      monthlySavingsGoals: monthlyGoalsMap,
      customStickers: data.customStickers.slice(-10),
      placedStickers: data.placedStickers.slice(-50),
      monthImages: data.monthImages,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedData));
  } catch (error) {
    console.error('Storage quota exceeded. Clearing old data...');
    const minimalData = {
      ...data,
      customStickers: [],
      placedStickers: [],
      monthImages: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
  }
};

export const calculateNextDueDate = (currentDate: string, category: 'monthly' | 'biweekly' | 'miscellaneous'): string => {
  const date = new Date(currentDate + 'T00:00:00');
  if (category === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (category === 'biweekly') {
    date.setDate(date.getDate() + 14);
  }
  return date.toISOString().split('T')[0];
};

export const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  return due < today;
};

export const calculateDebtPayoffMonths = (remaining: number, payment: number, interestRate: number): number => {
  if (payment <= 0) return 999;
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return Math.ceil(remaining / payment);
  const months = Math.log(payment / (payment - remaining * monthlyRate)) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
};

export const computeNextSelfCareDue = (fromDate: string | undefined, frequency: SelfCareItem['frequency'] | undefined): string | undefined => {
  const base = fromDate ? new Date(fromDate + 'T00:00:00') : new Date();
  if (!frequency) return undefined;
  const d = new Date(base);
  if (frequency === 'daily') d.setDate(d.getDate() + 1);
  else if (frequency === 'weekly') d.setDate(d.getDate() + 7);
  else if (frequency === 'monthly') d.setMonth(d.getMonth() + 1);
  else return undefined;
  return d.toISOString().split('T')[0];
};

export const isDebtOverdue = (dueDate: string, lastPaymentDate?: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  
  if (!lastPaymentDate) {
    return due < today;
  }
  
  const lastPayment = new Date(lastPaymentDate + 'T00:00:00');
  const nextDue = new Date(lastPayment);
  nextDue.setMonth(nextDue.getMonth() + 1);
  
  return nextDue < today;
};

export const parseHeight = (heightStr: string): number => {
  const feetInchesMatch = heightStr.match(/(\d+)['']?\s*['\"]?\s*(\d+)/i);
  if (feetInchesMatch) {
    const feet = parseInt(feetInchesMatch[1]);
    const inches = parseInt(feetInchesMatch[2]);
    return Math.round((feet * 30.48) + (inches * 2.54));
  }
  
  const feetOnlyMatch = heightStr.match(/(\d+)['ft]/i);
  if (feetOnlyMatch) {
    const feet = parseInt(feetOnlyMatch[1]);
    return Math.round(feet * 30.48);
  }
  
  const cmMatch = heightStr.match(/(\d+)\s*cm/i);
  if (cmMatch) {
    return parseInt(cmMatch[1]);
  }
  
  const numOnly = parseInt(heightStr);
  if (!isNaN(numOnly)) {
    return numOnly < 10 ? Math.round(numOnly * 30.48) : numOnly;
  }
  
  return 170;
};

export const getWeekDates = (date?: string): string[] => {
  const today = date ? new Date(date + 'T12:00:00') : new Date();
  const day = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);
  
  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d.toISOString().split('T')[0]);
  }
  
  return week;
};

export const getCurrentWeekDates = (): string[] => {
  return getWeekDates();
};

export const getCurrentWeekStart = (): string => {
  const today = new Date();
  const day = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);
  return sunday.toISOString().split('T')[0];
};

export const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

export const convertTo24Hour = (time12: string): string => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

export const generateDailyInsights = (): AIInsight => {
  const today = new Date().toISOString().split('T')[0];
  const financeTips = [
    "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    "Review your subscriptions today - cancel ones you don't use",
    "Set up automatic transfers to your savings account",
    "Track every expense for a week to identify spending patterns",
    "Consider negotiating your monthly bills for better rates"
  ];
  const fitnessTips = [
    "Take a 10-minute walk after each meal to boost metabolism",
    "Stay hydrated - aim for 8 glasses of water today",
    "Try a new workout routine to challenge your muscles",
    "Focus on proper form over heavy weights",
    "Get 7-9 hours of sleep for optimal recovery"
  ];
  const mealTips = [
    "Meal prep on Sunday to save time and money all week",
    "Add more protein to breakfast for sustained energy",
    "Try batch cooking grains and proteins for easy meals",
    "Keep healthy snacks prepared to avoid impulse eating",
    "Use herbs and spices to add flavor without extra calories"
  ];
  
  const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  return {
    id: today,
    date: today,
    financeTip: random(financeTips),
    fitnessTip: random(fitnessTips),
    mealTip: random(mealTips)
  };
};

export const generateAIMealPlan = (profile: FitnessProfile): GeneratedMealPlan => {
  const heightCm = parseHeight(profile.height);
  const bmr = 10 * (profile.weight * 0.453592) + 6.25 * heightCm - 5 * profile.age + (profile.weight > 0 ? 5 : -161);
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  };
  
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  const goalAdjustment = profile.goal === 'lose' ? -500 : profile.goal === 'gain' ? 500 : 0;
  const targetCalories = Math.round(tdee + goalAdjustment);
  
  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();
  
  const breakfasts = [
    "Greek yogurt with berries, honey, and granola",
    "Scrambled eggs with spinach, tomatoes, and whole wheat toast",
    "Oatmeal with banana, almond butter, and chia seeds",
    "Protein smoothie with spinach, banana, and protein powder",
    "Avocado toast with poached eggs and cherry tomatoes"
  ];
  
  const lunches = [
    "Grilled chicken salad with mixed greens and balsamic vinaigrette",
    "Quinoa bowl with roasted vegetables and chickpeas",
    "Turkey and avocado wrap with side salad",
    "Salmon with brown rice and steamed broccoli",
    "Chicken stir-fry with mixed vegetables and brown rice"
  ];
  
  const dinners = [
    "Baked cod with roasted sweet potato and asparagus",
    "Lean beef stir-fry with bell peppers and quinoa",
    "Grilled chicken breast with cauliflower rice and green beans",
    "Shrimp pasta with zucchini noodles and marinara",
    "Turkey meatballs with spaghetti squash and marinara sauce"
  ];
  
  const snackOptions = ["Apple with almond butter", "Handful of mixed nuts", "Protein bar", "Carrots and hummus", "Greek yogurt"];
  
  return {
    generatedDate: today,
    breakfast: breakfasts[dayOfWeek % breakfasts.length],
    lunch: lunches[dayOfWeek % lunches.length],
    dinner: dinners[dayOfWeek % dinners.length],
    snacks: [snackOptions[dayOfWeek % snackOptions.length], snackOptions[(dayOfWeek + 1) % snackOptions.length]],
    calories: targetCalories,
    ingredients: ["Chicken breast", "Mixed vegetables", "Brown rice", "Greek yogurt", "Berries", "Eggs", "Spinach", "Sweet potato"],
    tip: profile.goal === 'lose' ? "Focus on high-protein, low-carb meals for weight loss" : 
         profile.goal === 'gain' ? "Increase portion sizes and add healthy fats" : 
         "Maintain balanced macros for optimal health"
  };
};