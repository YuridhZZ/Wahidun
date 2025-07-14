import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function EditProfilePage() {
    const { user, refreshUserData } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await fetch(
                `https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${user.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error('Update failed');

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            await refreshUserData();

            setStatus({ loading: false, error: '', success: 'Profile updated successfully.' });
        } catch (error) {
            setStatus({ loading: false, error: error.message, success: '' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="name" className="flex block mb-2 text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="flex block mb-2 text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="flex block mb-2 text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pr-10 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                {status.error && <p className="text-red-500 text-sm">{status.error}</p>}
                {status.success && <p className="text-green-500 text-sm">{status.success}</p>}
                <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={status.loading}
                >
                    {status.loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}

export default EditProfilePage;
