import Card from '../UI/Card';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function SummaryCards({ income, expenses, balance }) {
    const cards = [
        {
            title: 'Total Income',
            amount: `₹${income.toLocaleString()}`,
            icon: <ArrowUpRight className="text-[var(--color-success)]" />,
            color: 'text-[var(--color-success)]'
        },
        {
            title: 'Total Expenses',
            amount: `₹${expenses.toLocaleString()}`,
            icon: <ArrowDownRight className="text-[var(--color-danger)]" />,
            color: 'text-[var(--color-danger)]'
        },
        {
            title: 'Balance',
            amount: `₹${balance.toLocaleString()}`,
            subtitle: 'Your current balance',
            icon: <Wallet className="text-[var(--color-primary)]" />,
            color: 'text-[var(--color-primary)]'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {cards.map((card, idx) => (
                <Card key={idx} className="flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{card.title}</span>
                        {card.icon}
                    </div>
                    <div className={`text-3xl font-bold ${card.color} mt-2`}>
                        {card.amount}
                    </div>
                    {card.subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-1">{card.subtitle}</p>}
                </Card>
            ))}
        </div>
    );
}