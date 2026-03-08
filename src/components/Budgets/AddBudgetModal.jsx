import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';

export default function AddBudgetModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        category: 'Rent',
        targetAmount: '',
        period: 'monthly'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            targetAmount: parseFloat(formData.targetAmount)
        });
        onClose();
        setFormData({ category: 'Rent', targetAmount: '', period: 'monthly' });
    };

    const categories = ['Rent', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Add Budget Goal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
                        <input
                            type="number"
                            placeholder="5000"
                            value={formData.targetAmount}
                            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                        <select 
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1">Add Budget</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}


