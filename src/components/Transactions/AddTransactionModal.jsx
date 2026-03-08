import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function AddTransactionModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validate amount
        const amountValue = parseFloat(formData.amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        // Make amount negative if it's an expense
        let finalAmount = amountValue;
        if (formData.type === 'expense') {
            finalAmount = -Math.abs(amountValue);
        } else {
            finalAmount = Math.abs(amountValue);
        }

        console.log('Submitting transaction:', {
            ...formData,
            amount: finalAmount
        });

        onSubmit({
            ...formData,
            amount: finalAmount
        });
        onClose();
        setFormData({ description: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], type: 'expense' });
    };

    const categories = ['Rent', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Salary', 'Freelance', 'Investment', 'Other'];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Transaction Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === 'expense'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Expense</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === 'income'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Income</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            placeholder="e.g. rent paid"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1">Add Transaction</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}