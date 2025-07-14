import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateAccountNumber } from '../utils/generateAccNumber';
import { Link } from 'react-router';

function AddAccountPage() {
    const { user, refreshUserData } = useAuth(); 
    const [formData, setFormData] = useState({
        accountType: user?.accountType|| 'Saving', // Default to Saving
        accountNumber: generateAccountNumber(),
        balance: 1000000,
        termsAccepted: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setStatus({ loading: true, error: '', success: '' }); // Update status to loading

        try {
            const existingUserResponse = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${user.id}`);
            if (!existingUserResponse.ok) {
                const errorData = await existingUserResponse.json();
                throw new Error(errorData.message || 'Failed to fetch existing user data.');
            }
            const existingUser = await existingUserResponse.json();

            // --- STEP 2: Custom Merge Logic for accountType (Appending) ---
            let newAccountType, newAccountNumber, newBalance;
            // Check if existingUser.accountType exists and is not empty
            if (existingUser.accountType || existingUser.accountNumber || existingUser.balance) {
                // If existing is a string, append to it
                newAccountType = `${existingUser.accountType},${formData.accountType}`;
                newAccountNumber = `${existingUser.accountNumber},${formData.accountNumber}`;
                newBalance = `${existingUser.balance},${formData.balance}`;
            } else {
                // If no existing accountType, just use the new one
                newAccountType = formData.accountType;
                newAccountNumber = formData.accountNumber;
                newBalance = formData.balance;
            }

            // --- STEP 3: Create the final data object to send ---
            // Include all existing user data, then override/add specific fields.
            const dataToSend = {
                ...existingUser, // Keep all existing fields
                accountType: newAccountType, // Use the appended accountType
                accountNumber: newAccountNumber,
                balance: newBalance
            };

            // Remove any fields from dataToSend that MockAPI.io might automatically manage
            // or that you absolutely don't want to send back (e.g., 'id' is often not sent in PUT body)
            delete dataToSend.id; // MockAPI.io generates/manages IDs, so don't send it back in the body for PUT

            // You might also consider if 'createdAt' or 'updatedAt' should be removed if MockAPI.io handles them.
            // delete dataToSend.createdAt;
            // delete dataToSend.updatedAt;

            // --- STEP 3: Send the merged data in your PUT request ---
            const response = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${user.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend), // Send the merged data
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            await refreshUserData();

            setStatus({ loading: false, error: '', success: 'Profile updated successfully.' });
        } catch (error) {
            setError(error.message); // Set error for the component
            setStatus({ loading: false, error: error.message, success: '' }); // Update status
        } finally {
            setIsLoading(false); // Ensure loading is always set to false
        }

    };

    return (
        <section className="bg-white">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create another account
                        </h1>
                        {error && (
                            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="accountType" className="flex block mb-2 text-sm font-medium text-gray-900">Account Type</label>
                                <select
                                    id="accountType"
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                >
                                    <option value="Saving">Saving Account</option>
                                    <option value="Deposit">Deposit Account</option>
                                </select>
                            </div>
    
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="termsAccepted"
                                        type="checkbox"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500">I accept the <a className="font-medium text-blue-600 hover:underline" href="#">Terms and Conditions</a></label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-4 h-4 mr-2 inline animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : 'Add new account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddAccountPage;