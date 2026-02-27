import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import SummaryCards from '../components/Dashboard/SummaryCards';
import SpendingChart from '../components/Dashboard/SpendingChart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';

export default function Dashboard() {
    const { user, userId } = useAuth();
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
                [Query.equal('userId', userId), Query.limit(100)]
            );
            setTransactions(response.documents);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = income - expenses;

    const expensesByCategory = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
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

    const recentTx = transactions.length > 0 ? transactions.slice(0, 3) : [
        { description: 'rent paid', amount: -5000, date: '23/02/2026' },
        { description: 'coffee', amount: -500, date: '23/02/2026' },
        { description: 'salary credited', amount: 50000, date: '23/02/2026' }
    ];

    if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                {user && <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name || user.email}!</p>}
            </div>
            <SummaryCards income={income} expenses={expenses} balance={balance} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingChart data={chartData} />
                <RecentTransactions transactions={recentTx} />
            </div>
        </div>
    );
}