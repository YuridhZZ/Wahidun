import { create } from 'zustand';
import { addPendingTransaction } from '../utils/indexedDB';

export const useTransferStore = create((set, get) => ({
  // ... (state and other actions remain the same)
  currentStep: 1,
  status: 'idle',
  errorMessage: '',
  recipient: null,
  formData: { recipientAccountNumber: '', amount: '', notes: '' },
  nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set(state => ({ currentStep: state.currentStep - 1 })),
  updateFormData: (field, value) => set(state => ({ formData: { ...state.formData, [field]: value } })),
  validateRecipient: async (accountNumber, currentUser) => {
    set({ status: 'validating', errorMessage: '' });
    if (String(accountNumber) === String(currentUser.accountNumber)) {
        set({ status: 'error', errorMessage: 'You cannot send money to your own account.' });
        return false;
    }
    try {
      const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user');
      const users = await response.json();
      const foundUser = users.find(u => String(u.accountNumber) === String(accountNumber));
      if (foundUser) {
        set({ recipient: foundUser, status: 'idle' });
        return true;
      } else {
        set({ status: 'error', errorMessage: 'Recipient account not found.' });
        return false;
      }
    } catch (error) {
      set({ status: 'error', errorMessage: 'Failed to verify account. Please try again.' });
      return false;
    }
  },

  submitTransfer: async (currentUser, refreshUserData, refreshTransactions, logActivity) => {
    set({ status: 'submitting', errorMessage: '' });
    const { recipient, formData } = get();
    const nominal = parseFloat(formData.amount);
    
    const transactionPayload = {
      accountSourceId: currentUser.id,
      accountSourceName: currentUser.name,
      accountSourceNumber: currentUser.accountNumber,
      accountDestinationId: recipient.id,
      accountDestinationNumber: recipient.accountNumber,
      accountDestinationName: recipient.name,
      category: 'transfer',
      nominal: nominal,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    if (!navigator.onLine) {
      try {
        console.log("Offline: Queuing transaction locally.");
        await addPendingTransaction(transactionPayload); // Use native helper
        logActivity(`Queued offline transfer of Rp. ${nominal.toLocaleString()} to ${recipient.name}`);
        set({ status: 'success' });
        get().nextStep();
        return;
      } catch (error) {
        console.error("Failed to queue transaction offline:", error);
        set({ status: 'error', errorMessage: 'Could not save transaction offline.' });
        return;
      }
    }

    try {
      await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });
      await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: parseFloat(currentUser.balance) - nominal }),
      });
      await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${recipient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: parseFloat(recipient.balance) + nominal }),
      });
      
      logActivity(`Transferred Rp. ${nominal.toLocaleString()} to ${recipient.name}`);
      await Promise.all([refreshUserData(), refreshTransactions()]);
      
      set({ status: 'success' });
      get().nextStep();

    } catch (error) {
      set({ status: 'error', errorMessage: 'The transfer failed. Please try again.' });
    }
  },

  reset: () => set({
    currentStep: 1,
    status: 'idle',
    errorMessage: '',
    recipient: null,
    formData: { recipientAccountNumber: '', amount: '', notes: '' },
  }),
}));