import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Target, Plus } from 'lucide-react';

export default function Budgets() {
    const { userId } = useAuth();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchBudgets();
    }, [userId]);

    const fetchBudgets = async () => {
        if (!userId) return;
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.budgetsCollectionId,
                [Query.equal('userId', userId)]
            );
            setBudgets(response.documents);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Budget Goals</h2>
            {budgets.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-4">
                        <Target size={32} className="text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">You have no budgets yet</h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">Add one to get started!</p>
                    <Button><Plus size={18} /> Add Budget</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget, idx) => (
                        <Card key={idx}>
                            <span className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-sm font-medium">
                                {budget.category}
                            </span>
                            <p className="text-[var(--color-text-muted)] text-sm mt-4 mb-1">Target Amount</p>
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">₹{budget.targetAmount.toLocaleString()}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">Period: {budget.period || 'Monthly'}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}