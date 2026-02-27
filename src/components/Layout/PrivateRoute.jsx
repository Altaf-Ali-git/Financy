import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
    
    if (!user) return <Navigate to="/auth" replace />;
    
    return children;
}