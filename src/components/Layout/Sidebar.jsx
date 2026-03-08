import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PieChart, Target, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/transactions', icon: List, label: 'Transactions' },
    { path: '/dashboard/budgets', icon: Target, label: 'Budgets' },
    { path: '/dashboard/reports', icon: PieChart, label: 'Reports' },
];

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="w-60 bg-white border-r border-[var(--color-border)] h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-[var(--color-border)]">
                <h1 className="text-xl font-bold text-[var(--color-primary)]">Financy</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive 
                                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' 
                                : 'text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-primary)]'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[var(--color-border)]">
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-[var(--color-danger)] hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}