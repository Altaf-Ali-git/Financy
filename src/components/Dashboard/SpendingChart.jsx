import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../UI/Card';

export default function SpendingChart({ data = [] }) {
    const hasData = data.length > 0 && data.some(d => d.amount > 0);

    return (
        <Card className="h-96">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Spending Trends</h3>
                <p className="text-sm text-gray-500">A look at your expenses by category for this month.</p>
            </div>
            
            {!hasData ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <p className="text-lg font-medium">No expenses yet</p>
                        <p className="text-sm">Add transactions to see your spending trends</p>
                    </div>
                </div>
            ) : (
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
                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                        />
                        <Bar 
                            dataKey="amount" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#2563EB" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}