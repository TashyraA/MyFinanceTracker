import { useState } from 'react';
import { Check, Trash2, ShoppingCart, Edit2, Plus } from 'lucide-react';
import { ShoppingListItem } from '@/lib/storage';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onUpdate: (items: ShoppingListItem[]) => void;
}

const ShoppingList = ({ items, onUpdate }: ShoppingListProps) => {
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleToggle = (id: string) => {
    onUpdate(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleDelete = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleClearChecked = () => {
    onUpdate(items.filter(item => !item.checked));
  };

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const newItem: ShoppingListItem = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      ingredient: trimmed,
      checked: false,
    };
    onUpdate([newItem, ...items]);
    setNewText('');
  };

  const startEdit = (item: ShoppingListItem) => {
    setEditingId(item.id);
    setEditingText(item.ingredient);
  };

  const saveEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      // if empty, delete the item
      handleDelete(id);
      return;
    }
    onUpdate(items.map(it => it.id === id ? { ...it, ingredient: trimmed } : it));
    setEditingId(null);
    setEditingText('');
  };

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-coquette-rose" size={24} />
          <h2 className="text-xl font-bold text-coquette-darkBrown">Shopping List</h2>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={handleClearChecked}
            className="text-sm text-coquette-brown hover:text-coquette-darkBrown transition-colors"
          >
            Clear checked ({checkedCount})
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {items.length > 0 ? (
          items.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                item.checked
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-coquette-bg border-2 border-coquette-pink/30'
              }`}
            >
              <button
                onClick={() => handleToggle(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                  item.checked
                    ? 'bg-green-500 border-green-500'
                    : 'border-coquette-pink hover:border-coquette-rose'
                }`}
              >
                {item.checked && <Check size={16} className="text-white" />}
              </button>

              {editingId === item.id ? (
                <input
                  className="flex-1 p-1 bg-white border rounded px-2"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(item.id);
                    if (e.key === 'Escape') { setEditingId(null); setEditingText(''); }
                  }}
                  onBlur={() => saveEdit(item.id)}
                  autoFocus
                />
              ) : (
                <p
                  onDoubleClick={() => startEdit(item)}
                  className={`flex-1 cursor-text ${item.checked ? 'line-through text-green-700' : 'text-coquette-darkBrown'}`}>
                  {item.ingredient}
                </p>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(item)}
                  title="Edit"
                  className="p-1 text-coquette-brown hover:bg-coquette-bg rounded transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-coquette-brown">
            <p className="text-sm">Your shopping list is empty. Add meal prep to generate a list!</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex gap-2 items-center">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Add extra item (e.g. Almond milk)"
            className="flex-1 p-2 border rounded-lg"
            aria-label="Add extra shopping item"
          />
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-3 py-2 bg-coquette-rose text-white rounded-lg"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-4 p-3 bg-coquette-bg rounded-lg">
          <p className="text-xs text-coquette-brown">
            📝 {items.length - checkedCount} items remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;