import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-60 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}