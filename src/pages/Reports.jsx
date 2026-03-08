import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import SpendingChart from '../components/Dashboard/SpendingChart';
import Card from '../components/UI/Card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, AlertCircle } from 'lucide-react';

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

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    // Group expenses by category
    const expensesByCategory = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
            const existing = acc.find(item => item.category === t.category);
            if (existing) existing.amount += Math.abs(t.amount);
            else acc.push({ category: t.category, amount: Math.abs(t.amount) });
            return acc;
        }, []);

    // Sort by amount descending
    const sortedExpenses = [...expensesByCategory].sort((a, b) => b.amount - a.amount);

    // Top expense category
    const topExpense = sortedExpenses.length > 0 ? sortedExpenses[0] : null;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const hasTransactions = transactions.length > 0;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
                <p className="text-sm text-gray-500 mt-1">Financial insights and analysis</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <p className="text-xl font-bold text-gray-900">₹{totalIncome.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <TrendingDown className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Expenses</p>
                            <p className="text-xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Net Balance</p>
                            <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>
                
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <PiggyBank className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Savings Rate</p>
                            <p className={`text-xl font-bold ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {savingsRate}%
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Chart Section */}
            {/* <Card className="mb-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Spending Trends</h3>
                    <p className="text-sm text-gray-500">Expenses breakdown by category</p>
                </div>
                
                {hasTransactions && expensesByCategory.length > 0 ? (
                    <SpendingChart data={expensesByCategory} />
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <p className="text-lg font-medium">No expense data</p>
                            <p className="text-sm">Add transactions to see spending trends</p>
                        </div>
                    </div>
                )}
            </Card> */}

            {/* Additional Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Breakdown */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
                    
                    {sortedExpenses.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No expenses recorded</p>
                    ) : (
                        <div className="space-y-4">
                            {sortedExpenses.map((item, idx) => {
                                const percentage = totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(1) : 0;
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 font-medium">{item.category}</span>
                                            <span className="text-gray-900">₹{item.amount.toLocaleString()} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full" 
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Insights & Recommendations */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
                    
                    <div className="space-y-3">
                        {savingsRate < 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="text-red-500 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Overspending Alert</p>
                                        <p className="text-xs text-red-600 mt-1">You're spending more than you earn. Review your expenses immediately.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {savingsRate >= 0 && savingsRate < 20 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700">Room for Improvement</p>
                                        <p className="text-xs text-yellow-600 mt-1">Your savings rate is below 20%. Try to reduce unnecessary expenses.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {savingsRate >= 20 && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <TrendingUp className="text-green-500 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Great Savings!</p>
                                        <p className="text-xs text-green-600 mt-1">You're saving over 20% of your income. Keep up the good work!</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {topExpense && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <DollarSign className="text-blue-500 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Largest Expense</p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Your biggest expense is {topExpense.category} at ₹{topExpense.amount.toLocaleString()}.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!hasTransactions && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="text-gray-500 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Get Started</p>
                                        <p className="text-xs text-gray-600 mt-1">Add transactions to see personalized insights about your spending habits.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}






