import { useState } from 'react';
import { useTransferStore } from '../../store/transferStore';
import { useAuth } from '../../contexts/AuthContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useActivityLog } from '../../hooks/useActivityLog';

function Step3Confirm() {
  const { user, refreshUserData } = useAuth();
  const { refreshTransactions } = useTransactions();
  const { logActivity } = useActivityLog();
  const { recipient, formData, prevStep, submitTransfer, status, errorMessage } = useTransferStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleConfirmClick = () => {
    setPasswordInput('');
    setPasswordError('');
    setIsModalOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === user.password) {
      setIsModalOpen(false);
      submitTransfer(user, refreshUserData, refreshTransactions, logActivity);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Confirm Transfer</h3>
      <p className="mt-1 text-sm text-gray-500">Please review the details below before confirming the transfer.</p>

      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Recipient</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{recipient?.name}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Account Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{recipient?.accountNumber}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 text-sm font-bold text-indigo-600 sm:col-span-2 sm:mt-0">
              Rp. {parseFloat(formData.amount).toLocaleString()}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{formData.notes || 'N/A'}</dd>
          </div>
        </dl>
        {status === 'error' && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      </div>

      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={status === 'submitting'}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-100"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={status === 'submitting'}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
          >
            Confirm & Send
          </button>
        </div>
      </div>

      {/* Password Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Enter Your Password</h3>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Your password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />
            {passwordError && (
              <p className="text-sm text-red-500 mb-2">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm border rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step3Confirm;