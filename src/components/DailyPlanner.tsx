import { useState } from 'react';
import { Plus, Check, Trash2, Clock } from 'lucide-react';
import { PlannerTask } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface DailyPlannerProps {
  selectedDate: string;
  tasks: PlannerTask[];
  onUpdate: (tasks: PlannerTask[]) => void;
}

const DailyPlanner = ({ selectedDate, tasks, onUpdate }: DailyPlannerProps) => {
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');

  const todayTasks = tasks
    .filter((t) => t.date === selectedDate)
    .sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

  const handleAdd = () => {
    if (newTask.trim()) {
      const task: PlannerTask = {
        id: uuidv4(),
        date: selectedDate,
        text: newTask.trim(),
        time: newTime || undefined,
        completed: false,
      };
      onUpdate([...tasks, task]);
      setNewTask('');
      setNewTime('');
    }
  };

  const handleToggle = (id: string) => {
    onUpdate(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (id: string) => {
    onUpdate(tasks.filter((t) => t.id !== id));
  };

  const stickers = ['⭐', '💖', '🌸', '🦋', '✨', '💕', '🌺', '🎀'];

  return (
    <div className="bg-gradient-to-br from-white to-coquette-bg rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <h2 className="text-xl font-bold text-coquette-darkBrown">Daily Schedule</h2>
        </div>
        <div className="flex gap-1">
          {stickers.map((sticker, i) => (
            <span
              key={i}
              className="text-xl cursor-pointer hover:scale-125 transition-transform"
            >
              {sticker}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {todayTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              task.completed
                ? 'bg-coquette-pink/20 border-2 border-coquette-rose/50'
                : 'bg-white border-2 border-coquette-pink/30 hover:border-coquette-pink'
            }`}
          >
            <button
              onClick={() => handleToggle(task.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-coquette-rose border-coquette-rose'
                  : 'border-coquette-pink hover:border-coquette-rose'
              }`}
            >
              {task.completed && <Check size={16} className="text-white" />}
            </button>
            {task.time && (
              <div className="flex items-center gap-1 text-coquette-brown text-sm">
                <Clock size={14} />
                <span>{task.time}</span>
              </div>
            )}
            <p
              className={`flex-1 ${
                task.completed
                  ? 'line-through text-coquette-brown/70'
                  : 'text-coquette-darkBrown'
              }`}
            >
              {task.text}
            </p>
            <button
              onClick={() => handleDelete(task.id)}
              className="flex-shrink-0 p-1 text-coquette-deep hover:bg-coquette-pink/10 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-32 px-3 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink"
        />
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task for today..."
          className="flex-1 px-4 py-2 border-2 border-coquette-pink/30 rounded-lg focus:outline-none focus:border-coquette-pink text-coquette-darkBrown"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors font-medium"
        >
          <Plus size={20} />
          Add
        </button>
      </div>
    </div>
  );
};

export default DailyPlanner;
