import Card from '../UI/Card';
import { ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentTransactions({ transactions = [] }) {
    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <p className="text-sm text-gray-500">
                        {transactions.length > 0 
                            ? `You have ${transactions.length} recent transactions`
                            : 'No transactions yet'}
                    </p>
                </div>
                {transactions.length > 0 && (
                    <Link to="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All
                    </Link>
                )}
            </div>
            
            {transactions.length === 0 ? (
                <div className="py-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Receipt className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500 mb-2">No transactions found</p>
                    <Link to="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Add your first transaction
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((tx, idx) => {
                        const isIncome = tx.amount > 0;
                        return (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {isIncome 
                                            ? <ArrowUpRight size={18} className="text-green-500" /> 
                                            : <ArrowDownRight size={18} className="text-red-500" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 capitalize">{tx.description}</p>
                                        <p className="text-xs text-gray-400">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                    {isIncome ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}