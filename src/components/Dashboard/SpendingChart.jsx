import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../UI/Card';

export default function SpendingChart({ data }) {
    return (
        <Card className="h-96">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Spending Trends</h3>
                <p className="text-sm text-[var(--color-text-muted)]">A look at your expenses by category for this month.</p>
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data}>
                    <XAxis 
                        dataKey="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar 
                        dataKey="amount" 
                        fill="#2563EB" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}