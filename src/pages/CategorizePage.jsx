import React, { useMemo } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';

const DraggableTransaction = ({ transaction }) => {
  const handleDragStart = (e, tx) => {
    e.dataTransfer.setData('transaction', JSON.stringify(tx));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, transaction)}
      className="p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move flex justify-between items-center"
    >
      <div>
        <p className="font-medium">{`Transfer to ${transaction.accountDestinationName}`}</p>
        <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
      </div>
      <p className="font-semibold text-red-600">-Rp. {parseFloat(transaction.nominal).toLocaleString()}</p>
    </div>
  );
};

const CategoryDropZone = ({ category, onDrop, onDragOver, onUncategorize, onDelete }) => {
  return (
    <div
      onDrop={(e) => onDrop(e, category.id)}
      onDragOver={onDragOver}
      className="bg-gray-50 p-4 border-2 border-dashed rounded-lg min-h-[200px] transition-colors duration-200 flex flex-col"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">{category.name}</h4>
        {category.name !== 'Uncategorized' && (
            <button onClick={() => onDelete(category.id)} className="text-gray-400 hover:text-red-600" title="Delete Category">
                <TrashIcon className="h-5 w-5" />
            </button>
        )}
      </div>
      <div className="space-y-1 flex-grow">
        {category.transactions.map(tx => (
          <div key={tx.id} className="text-sm bg-white p-2 rounded-md shadow-sm flex justify-between items-center">
            <div className="flex-grow">
              <span>{tx.accountDestinationName}</span>
              <span className="block text-xs text-gray-500">-Rp. {parseFloat(tx.nominal).toLocaleString()}</span>
            </div>
            <button onClick={() => onUncategorize(tx.id)} className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl" title="Uncategorize">
              &times;
            </button>
          </div>
        ))}
        {category.transactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center pt-10">Drag expenses here</p>
        )}
      </div>
    </div>
  );
};

function CategorizePage() {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const { categories, addCategory, assignTransactionToCategory, uncategorizeTransaction, deleteCategory } = useCategories();

  const userExpenses = useMemo(() => 
    transactions.filter(tx => String(tx.accountSourceId) === String(user.id))
  , [transactions, user]);
  
  const categorizedTransactionIds = useMemo(() => 
    new Set(categories.flatMap(cat => cat.transactions.map(t => t.id)))
  , [categories]);

  const uncategorizedExpenses = userExpenses.filter(
    tx => !categorizedTransactionIds.has(tx.id)
  );

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    const transaction = JSON.parse(e.dataTransfer.getData('transaction'));
    assignTransactionToCategory(categoryId, transaction);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const categoryName = e.target.elements.categoryName.value;
    addCategory(categoryName);
    e.target.reset();
  };

  const handleDeleteCategory = (categoryId) => {
      if (window.confirm("Are you sure you want to delete this category? All its transactions will be moved to 'Uncategorized'.")) {
          deleteCategory(categoryId);
      }
  };

  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold px-4 mb-6">Categorize Your Spending</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Uncategorized Expenses</h3>
            <div className="max-h-[600px] overflow-y-auto pr-2">
              {uncategorizedExpenses.length > 0 ? (
                uncategorizedExpenses.map(tx => <DraggableTransaction key={tx.id} transaction={tx} />)
              ) : (
                <p className="text-gray-500 mt-4 text-center">No new expenses to categorize.</p>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleAddCategory} className="flex gap-2">
                    <input name="categoryName" type="text" placeholder="Create a new category" className="flex-grow border-gray-300 rounded-md shadow-sm"/>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add</button>
                </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(cat => (
                <CategoryDropZone 
                  key={cat.id} 
                  category={cat} 
                  onDrop={handleDrop} 
                  onDragOver={handleDragOver}
                  onUncategorize={uncategorizeTransaction}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CategorizePage;