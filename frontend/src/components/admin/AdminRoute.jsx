// Create src/components/admin/AdminRoute.jsx
import { useAuth } from '../../contexts/AuthContext';
import LoginPage from './LoginPage';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <LoginPage />;
};

export default AdminRoute;