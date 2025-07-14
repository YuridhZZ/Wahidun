import React from 'react';
import { useTransferStore } from '../../store/transferStore';
import { useAuth } from '../../contexts/AuthContext';

function Step1Recipient() {
  const { user } = useAuth();
  const { formData, updateFormData, validateRecipient, nextStep, status, errorMessage } = useTransferStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateRecipient(formData.recipientAccountNumber, user);
    if (isValid) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Recipient Information</h3>
      <p className="mt-1 text-sm text-gray-500">Enter the account number of the person you want to send money to.</p>
      
      <div className="mt-6">
        <label htmlFor="recipientAccountNumber" className="block text-sm font-medium text-gray-700">
          Recipient's Account Number
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="recipientAccountNumber"
            name="recipientAccountNumber"
            value={formData.recipientAccountNumber}
            onChange={(e) => updateFormData('recipientAccountNumber', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0123456789"
            required
          />
        </div>
        {status === 'error' && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      </div>

      <div className="mt-8 pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === 'validating'}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
          >
            {status === 'validating' ? 'Validating...' : 'Next'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default Step1Recipient;