import React from 'react';
import ShoppingList from '@/components/ShoppingList';
import { getFinanceData, saveFinanceData, ShoppingListItem } from '@/lib/storage';

const HouseholdShopping: React.FC = () => {
  const [items, setItems] = React.useState<ShoppingListItem[]>(() => getFinanceData().shoppingList || []);

  const persist = (next: ShoppingListItem[]) => {
    setItems(next);
    const data = getFinanceData();
    data.shoppingList = next;
    saveFinanceData(data);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-coquette-darkBrown mb-4">Household Shopping</h1>
      <p className="text-sm text-coquette-brown mb-4">Manage a household shopping list separate from meal prep items.</p>
      <ShoppingList items={items} onUpdate={(list) => persist(list)} />
    </div>
  );
};

export default HouseholdShopping;
