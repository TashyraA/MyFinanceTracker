import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { FitnessProfile, GeneratedMealPlan, generateAIMealPlan, MealPrepItem, ShoppingListItem, parseHeight } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface MealPlanGeneratorProps {
  profile?: FitnessProfile;
  generatedPlan?: GeneratedMealPlan;
  shoppingList: ShoppingListItem[];
  onUpdateProfile: (profile: FitnessProfile) => void;
  onUpdatePlan: (plan?: GeneratedMealPlan) => void;
  onAcceptPlan: (meals: MealPrepItem[]) => void;
  onUpdateShoppingList: (list: ShoppingListItem[]) => void;
}

const MealPlanGenerator = ({ profile, generatedPlan, shoppingList, onUpdateProfile, onUpdatePlan, onAcceptPlan, onUpdateShoppingList }: MealPlanGeneratorProps) => {
  const [showForm, setShowForm] = useState(!profile);
  const [weight, setWeight] = useState(profile?.weight.toString() || '');
  const [height, setHeight] = useState(profile?.height || '');
  const [age, setAge] = useState(profile?.age.toString() || '');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>(profile?.goal || 'maintain');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>(profile?.activityLevel || 'moderate');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-regenerate daily if plan is from a different day
  useEffect(() => {
    if (profile && generatedPlan) {
      const today = new Date().toISOString().split('T')[0];
      if (generatedPlan.generatedDate !== today) {
        handleGenerate();
      }
    }
  }, [profile]);

  const handleSaveProfile = () => {
    if (weight && height && age) {
      const newProfile: FitnessProfile = {
        weight: parseFloat(weight),
        height: height,
        age: parseInt(age),
        goal,
        activityLevel,
      };
      onUpdateProfile(newProfile);
      setShowForm(false);
      
      // Generate AI plan
      setIsGenerating(true);
      setTimeout(() => {
        const plan = generateAIMealPlan(newProfile);
        onUpdatePlan(plan);
        setIsGenerating(false);
      }, 1000);
    }
  };

  const handleGenerate = () => {
    if (profile) {
      setIsGenerating(true);
      // Simulate AI processing
      setTimeout(() => {
        const plan = generateAIMealPlan(profile);
        onUpdatePlan(plan);
        setIsGenerating(false);
      }, 1000);
    }
  };

  const handleAccept = () => {
    if (generatedPlan) {
      const today = new Date().toISOString().split('T')[0];
      const meals: MealPrepItem[] = [
        {
          id: uuidv4(),
          weekStart: today,
          mealName: `Breakfast: ${generatedPlan.breakfast}`,
          ingredients: [],
        },
        {
          id: uuidv4(),
          weekStart: today,
          mealName: `Lunch: ${generatedPlan.lunch}`,
          ingredients: [],
        },
        {
          id: uuidv4(),
          weekStart: today,
          mealName: `Dinner: ${generatedPlan.dinner}`,
          ingredients: [],
        },
      ];
      
      if (generatedPlan.snacks.length > 0) {
        meals.push({
          id: uuidv4(),
          weekStart: today,
          mealName: `Snacks: ${generatedPlan.snacks.join(', ')}`,
          ingredients: [],
        });
      }
      
      onAcceptPlan(meals);
      
      // Add ingredients to shopping list
      const newShoppingItems = generatedPlan.ingredients.map(ingredient => ({
        id: uuidv4(),
        ingredient,
        checked: false,
      }));
      onUpdateShoppingList([...shoppingList, ...newShoppingItems]);
      
      onUpdatePlan(undefined);
    }
  };

  const handleDecline = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (profile) {
        const plan = generateAIMealPlan(profile);
        onUpdatePlan(plan);
      }
      setIsGenerating(false);
    }, 1000);
  };

  const getHeightDisplay = () => {
    if (!profile) return '';
    const heightCm = parseHeight(profile.height);
    const feet = Math.floor(heightCm / 30.48);
    const inches = Math.round((heightCm % 30.48) / 2.54);
    return `${profile.height} (${feet}'${inches}" / ${heightCm}cm)`;
  };

  return (
    <div className="bg-gradient-to-br from-white to-coquette-bg rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-coquette-rose animate-pulse" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">AI Meal Plan Generator</h2>
        {generatedPlan?.generatedDate && (
          <span className="text-xs text-coquette-brown ml-auto">
            Generated: {new Date().toLocaleDateString()}
          </span>
        )}
      </div>

      {showForm ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-coquette-brown">Weight (lbs)</label>
              <input
                type="number"
                placeholder="150"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
            </div>
            <div>
              <label className="text-xs text-coquette-brown">Height</label>
              <input
                type="text"
                placeholder="5'3 or 163cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
              />
            </div>
          </div>
          <div className="text-xs text-coquette-brown bg-coquette-bg p-2 rounded">
            💡 Height formats: 5'3, 5'3", 5ft 3in, 163cm, or just 163
          </div>
          <div>
            <label className="text-xs text-coquette-brown">Age</label>
            <input
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
            />
          </div>
          <div>
            <label className="text-xs text-coquette-brown">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
            >
              <option value="lose">🔥 Lose Weight</option>
              <option value="maintain">⚖️ Maintain Weight</option>
              <option value="gain">💪 Gain Weight</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-coquette-brown">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
            >
              <option value="sedentary">😴 Sedentary (little/no exercise)</option>
              <option value="light">🚶 Light (1-3 days/week)</option>
              <option value="moderate">🏃 Moderate (3-5 days/week)</option>
              <option value="active">💪 Active (6-7 days/week)</option>
              <option value="very-active">🏋️ Very Active (athlete)</option>
            </select>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={!weight || !height || !age}
            className="w-full bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Profile & Generate AI Plan
          </button>
        </div>
      ) : generatedPlan ? (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border-2 border-coquette-pink/30">
            <h3 className="font-bold text-coquette-darkBrown mb-3">Today's AI-Generated Meal Plan</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-700 mb-1">🍳 Breakfast</p>
                <p className="text-coquette-darkBrown">{generatedPlan.breakfast}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-700 mb-1">🥗 Lunch</p>
                <p className="text-coquette-darkBrown">{generatedPlan.lunch}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="font-medium text-orange-700 mb-1">🍽️ Dinner</p>
                <p className="text-coquette-darkBrown">{generatedPlan.dinner}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-700 mb-1">🍪 Snacks</p>
                <p className="text-coquette-darkBrown">{generatedPlan.snacks.join(', ')}</p>
              </div>
              {generatedPlan.tip && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">{generatedPlan.tip}</p>
                </div>
              )}
              <div className="pt-2 border-t border-coquette-pink/30">
                <p className="font-bold text-coquette-darkBrown">📊 Total Calories: {generatedPlan.calories}</p>
                <p className="text-xs text-coquette-brown mt-1">
                  ✅ {generatedPlan.ingredients.length} ingredients will be added to your shopping list
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAccept}
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <Check size={20} />
              Accept & Add to List
            </button>
            <button
              onClick={handleDecline}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-coquette-rose text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
            >
              <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'AI Generating...' : 'Try Another'}
            </button>
          </div>
          
          <div className="p-3 bg-coquette-bg rounded-lg">
            <p className="text-xs text-coquette-brown">
              🤖 AI generates unique meal plans daily based on your profile and the day of the week!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {profile && (
            <div className="p-4 bg-white rounded-lg border-2 border-coquette-pink/30">
              <h3 className="font-bold text-coquette-darkBrown mb-2">Your Profile</h3>
              <div className="text-sm text-coquette-brown space-y-1">
                <p>⚖️ Weight: {profile.weight} lbs</p>
                <p>📏 Height: {getHeightDisplay()}</p>
                <p>🎂 Age: {profile.age} years</p>
                <p>🎯 Goal: {profile.goal.charAt(0).toUpperCase() + profile.goal.slice(1)} Weight</p>
                <p>🏃 Activity: {profile.activityLevel.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-sm text-coquette-pink hover:text-coquette-rose transition-colors"
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium disabled:opacity-50"
          >
            <Sparkles size={20} className={isGenerating ? 'animate-pulse' : ''} />
            {isGenerating ? 'AI Generating...' : 'Generate Today\'s AI Meal Plan'}
          </button>

          <div className="p-3 bg-coquette-bg rounded-lg">
            <p className="text-xs text-coquette-brown">
              💡 AI creates personalized meal plans that change daily with smart tips and insights!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanGenerator;