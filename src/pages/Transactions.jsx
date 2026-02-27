import { useEffect, useState } from 'react';
import { databases, APPWRITE_CONFIG } from '../services/appwrite';
import { Query, ID } from 'appwrite';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import TransactionTable from '../components/Transactions/TransactionTable';
import AddTransactionModal from '../components/Transactions/AddTransactionModal';
import { Plus } from 'lucide-react';

export default function Transactions() {
    const { userId } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                [Query.equal('userId', userId), Query.orderDesc('date')]
            );
            setTransactions(response.documents);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (data) => {
        if (!userId) return;
        try {
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.transactionsCollectionId,
                ID.unique(),
                { userId, ...data }
            );
            fetchTransactions();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const displayTransactions = transactions.length > 0 ? transactions : [
        { description: 'rent paid', amount: -5000, date: '23/02/2026', category: 'Rent' },
        { description: 'coffee', amount: -500, date: '23/02/2026', category: 'Other' },
        { description: 'salary credited', amount: 50000, date: '23/02/2026', category: 'Salary' }
    ];

    if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Transactions</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Transaction
                </Button>
            </div>
            <Card className="p-0 overflow-hidden">
                <TransactionTable transactions={displayTransactions} />
            </Card>
            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTransaction} />
        </div>
    );
}