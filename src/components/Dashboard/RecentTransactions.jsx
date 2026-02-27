import Card from '../UI/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
    return (
        <Card>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Transactions</h3>
                <p className="text-sm text-[var(--color-text-muted)]">You have {transactions.length} recent transactions.</p>
            </div>
            <div className="space-y-4">
                {transactions.map((tx, idx) => {
                    const isIncome = tx.amount > 0;
                    return (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isIncome ? 'bg-[var(--color-success)]/10' : 'bg-[var(--color-danger)]/10'}`}>
                                    {isIncome ? <ArrowUpRight size={18} className="text-[var(--color-success)]" /> : <ArrowDownRight size={18} className="text-[var(--color-danger)]" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)] capitalize">{tx.description}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{tx.date}</p>
                                </div>
                            </div>
                            <span className={`text-sm font-semibold ${isIncome ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                {isIncome ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}