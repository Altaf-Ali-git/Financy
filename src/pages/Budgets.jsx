import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query, ID } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import AddBudgetModal from '../components/Budgets/AddBudgetModal';
import { Target, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export default function Budgets() {
    const { userId } = useAuth();
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchBudgets();
            fetchTransactions();
        }
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
        }
    };

    const handleAddBudget = async (data) => {
        if (!userId) return;
        try {
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.budgetsCollectionId,
                ID.unique(),
                { userId, ...data }
            );
            fetchBudgets();
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    // Calculate spent amount for each budget category
    const getSpentAmount = (category) => {
        return transactions
            .filter(t => t.category === category && t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Budget Goals</h2>
                    <p className="text-sm text-gray-500 mt-1">{budgets.length} active budgets</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Budget
                </Button>
            </div>
            
            {budgets.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Target size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">You have no budgets yet</h3>
                    <p className="text-gray-500 mb-6">Create a budget to track your spending goals!</p>
                    
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget, idx) => {
                        const spent = getSpentAmount(budget.category);
                        const percentage = budget.targetAmount > 0 ? (spent / budget.targetAmount) * 100 : 0;
                        const isOverBudget = percentage > 100;
                        const remaining = budget.targetAmount - spent;

                        return (
                            <Card key={idx} className="relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        {budget.category}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{budget.period}</span>
                                </div>
                                
                                <p className="text-gray-500 text-sm mb-1">Target</p>
                                <p className="text-2xl font-bold text-gray-900 mb-4">₹{budget.targetAmount.toLocaleString()}</p>
                                
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Spent</span>
                                        <span className={isOverBudget ? 'text-red-500' : 'text-gray-700'}>
                                            ₹{spent.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-3">
                                    {isOverBudget ? (
                                        <TrendingUp size={16} className="text-red-500" />
                                    ) : (
                                        <TrendingDown size={16} className="text-green-500" />
                                    )}
                                    <span className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                                        {isOverBudget 
                                            ? `₹${Math.abs(remaining).toLocaleString()} over budget`
                                            : `₹${remaining.toLocaleString()} remaining`
                                        }
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <AddBudgetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddBudget}
            />
        </div>
    );
}