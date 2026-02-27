import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import SpendingChart from '../components/Dashboard/SpendingChart';
import Card from '../components/UI/Card';

export default function Reports() {
    const { userId } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchTransactions();
    }, [userId]);

    const fetchTransactions = async () => {
        if (!userId) return;
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.transactionsCollectionId,
                [Query.equal('userId', userId)]
            );
            setTransactions(response.documents);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const expensesByCategory = transactions.filter(t => t.amount < 0).reduce((acc, t) => {
        const existing = acc.find(item => item.category === t.category);
        if (existing) existing.amount += Math.abs(t.amount);
        else acc.push({ category: t.category, amount: Math.abs(t.amount) });
        return acc;
    }, []);

    const chartData = expensesByCategory.length > 0 ? expensesByCategory : [
        { category: 'Rent', amount: 6000 },
        { category: 'Other', amount: 4500 },
        { category: 'Food', amount: 3000 },
        { category: 'Transport', amount: 1500 }
    ];

    const totalExpenses = chartData.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

    if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-[var(--color-success)]">₹{totalIncome.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-[var(--color-danger)]">₹{totalExpenses.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Net Savings</p>
                    <p className={`text-2xl font-bold ${savings >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                        ₹{savings.toLocaleString()}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Savings Rate</p>
                    <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-danger)]'}`}>
                        {savingsRate}%
                    </p>
                </Card>
            </div>

            <Card className="h-[450px]">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Spending Trends</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">A look at your expenses by category for this month.</p>
                </div>
                <SpendingChart data={chartData} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Expense Breakdown</h3>
                    <div className="space-y-4">
                        {chartData.map((item, idx) => {
                            const percentage = totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(1) : 0;
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[var(--color-text-secondary)]">{item.category}</span>
                                        <span className="font-medium text-[var(--color-text-primary)]">₹{item.amount.toLocaleString()} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Insights</h3>
                    <div className="space-y-3">
                        {savingsRate < 20 && savingsRate > 0 && (
                            <div className="p-3 bg-[var(--color-danger)]/10 rounded-lg border border-[var(--color-danger)]/20">
                                <p className="text-sm font-medium text-[var(--color-danger)]">⚠️ Low Savings Rate</p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">Your savings rate is below 20%. Consider reviewing your expenses.</p>
                            </div>
                        )}
                        {savingsRate >= 20 && (
                            <div className="p-3 bg-[var(--color-success)]/10 rounded-lg border border-[var(--color-success)]/20">
                                <p className="text-sm font-medium text-[var(--color-success)]">✅ Great Savings!</p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">You're saving over 20% of your income. Keep it up!</p>
                            </div>
                        )}
                        {savingsRate < 0 && (
                            <div className="p-3 bg-[var(--color-danger)]/10 rounded-lg border border-[var(--color-danger)]/20">
                                <p className="text-sm font-medium text-[var(--color-danger)]">⚠️ Overspending</p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">You're spending more than you earn. Review your budget immediately.</p>
                            </div>
                        )}
                        <div className="p-3 bg-[var(--color-primary-light)] rounded-lg">
                            <p className="text-sm font-medium text-[var(--color-primary)]">📊 Largest Expense</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                {chartData.length > 0 
                                    ? `Your biggest expense is ${chartData[0].category} at ₹${chartData[0].amount.toLocaleString()}.`
                                    : 'No expenses recorded yet.'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}