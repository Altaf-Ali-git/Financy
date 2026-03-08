import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

export default function TransactionTable({ transactions, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Description</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Category</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                        <th className="text-center py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx, idx) => {
                        const isIncome = tx.amount > 0;
                        return (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {isIncome ? <ArrowUpRight size={16} className="text-green-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 capitalize">{tx.description}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">{tx.date}</td>
                                <td className="py-4 px-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        {tx.category}
                                    </span>
                                </td>
                                <td className={`py-4 px-4 text-sm font-semibold text-right ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                    {isIncome ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <button 
                                        onClick={() => onDelete(tx.$id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Delete transaction"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}