import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function AddTransactionModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
        onClose();
        setFormData({ description: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Add Transaction</h3>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <Input
                        label="Description"
                        placeholder="e.g. rent paid"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <Input
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Category</label>
                        <select 
                            className="px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-[var(--color-text-primary)]"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Rent">Rent</option>
                            <option value="Salary">Salary</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1">Add Transaction</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}