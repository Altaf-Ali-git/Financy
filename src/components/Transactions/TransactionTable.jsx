import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionTable({ transactions }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[var(--color-border)]">
                        <th className="text-left py-4 px-4 text-sm font-medium text-[var(--color-text-muted)]">Description</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-[var(--color-text-muted)]">Date</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-[var(--color-text-muted)]">Category</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-[var(--color-text-muted)]">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx, idx) => {
                        const isIncome = tx.amount > 0;
                        return (
                            <tr key={idx} className="border-b border-[var(--color-border)]/50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded ${isIncome ? 'bg-[var(--color-success)]/10' : 'bg-[var(--color-danger)]/10'}`}>
                                            {isIncome ? <ArrowUpRight size={16} className="text-[var(--color-success)]" /> : <ArrowDownRight size={16} className="text-[var(--color-danger)]" />}
                                        </div>
                                        <span className="text-sm font-medium text-[var(--color-text-primary)] capitalize">{tx.description}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-[var(--color-text-secondary)]">{tx.date}</td>
                                <td className="py-4 px-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-[var(--color-text-secondary)]">
                                        {tx.category}
                                    </span>
                                </td>
                                <td className={`py-4 px-4 text-sm font-semibold text-right ${isIncome ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                    {isIncome ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}