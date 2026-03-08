
import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query, ID } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import TransactionTable from '../components/Transactions/TransactionTable';
import AddTransactionModal from '../components/Transactions/AddTransactionModal';
import { Plus, Trash2 } from 'lucide-react';

export default function Transactions() {
    const { userId } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (userId) fetchTransactions();
    }, [userId]);

    // Helper function to format date to show only date (no time)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    const fetchTransactions = async () => {
        if (!userId) return;
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.transactionsCollectionId,
                [Query.equal('userId', userId), Query.orderDesc('date')]
            );
            
            // Format the date for each transaction before setting state
            const formattedTransactions = response.documents.map(doc => ({
                ...doc,
                date: formatDate(doc.date)
            }));

            setTransactions(formattedTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (data) => {
        if (!userId) {
            setError('User not logged in');
            return;
        }

        try {
            console.log('Creating transaction...');
            console.log('User ID:', userId);
            console.log('Data:', data);
            console.log('Config:', APPWRITE_CONFIG);

            const response = await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.transactionsCollectionId,
                ID.unique(),
                { 
                    userId: userId,
                    description: data.description,
                    amount: data.amount,
                    category: data.category,
                    date: data.date // Keep raw date for sorting/filtering in DB
                }
            );

            console.log('Transaction created successfully:', response);
            setSuccess('Transaction added successfully!');
            fetchTransactions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error adding transaction:', error);
            console.error('Error details:', error.message);
            console.error('Error code:', error.code);
            setError(`Failed to add transaction: ${error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            await databases.deleteDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.transactionsCollectionId,
                transactionId
            );
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
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
                    <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
                    <p className="text-sm text-gray-500 mt-1">{transactions.length} total transactions</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Transaction
                </Button>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                    {success}
                </div>
            )}
            
            <Card className="p-0 overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 mb-4">No transactions yet</p>
                        
                    </div>
                ) : (
                    <TransactionTable 
                        transactions={transactions} 
                        onDelete={handleDeleteTransaction}
                    />
                )}
            </Card>

            <AddTransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddTransaction}
            />
        </div>
    );
}