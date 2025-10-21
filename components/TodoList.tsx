import { useState } from 'react';
import { Plus, Check, Trash2, ListTodo } from 'lucide-react';
import { MonthlyGoal } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface TodoListProps {
  month: string;
  goals: MonthlyGoal[];
  onUpdate: (goals: MonthlyGoal[]) => void;
}

const TodoList = ({ month, goals, onUpdate }: TodoListProps) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    if (newTodo.trim()) {
      const todo: MonthlyGoal = {
        id: uuidv4(),
        text: newTodo.trim(),
        completed: false,
      };
      onUpdate([...goals, todo]);
      setNewTodo('');
    }
  };

  const handleToggle = (id: string) => {
    onUpdate(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDelete = (id: string) => {
    onUpdate(goals.filter(g => g.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <ListTodo className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">To-Do List</h2>
      </div>

      <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
        {goals.map(goal => (
          <div
            key={goal.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              goal.completed
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-coquette-bg border-2 border-coquette-pink/30'
            }`}
          >
            <button
              onClick={() => handleToggle(goal.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                goal.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-coquette-pink hover:border-coquette-rose'
              }`}
            >
              {goal.completed && <Check size={16} className="text-white" />}
            </button>
            <p className={`flex-1 ${goal.completed ? 'line-through text-green-700' : 'text-coquette-darkBrown'}`}>
              {goal.text}
            </p>
            <button
              onClick={() => handleDelete(goal.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
        />
        <button
          onClick={handleAdd}
          className="bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoList;