import React, { useState } from 'react';
import { useTransferStore } from '../../store/transferStore';
import { useAuth } from '../../contexts/AuthContext';

function Step2Amount() {
  const { user } = useAuth();
  const { formData, updateFormData, nextStep, prevStep } = useTransferStore();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (amount > user.balance) {
      setError('Amount exceeds your current balance.');
      return;
    }
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Transfer Details</h3>
      <p className="mt-1 text-sm text-gray-500">Specify the amount you wish to send.</p>

      <div className="mt-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (Rp.)
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={(e) => updateFormData('amount', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="50000"
            required
            step="0.01"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => updateFormData('notes', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., For lunch"
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
}

export default Step2Amount;
