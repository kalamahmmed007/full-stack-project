import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children, role }) => {
    const { admin, isAuthenticated } = useSelector(state => state.admin);

    if (!isAuthenticated) return <Navigate to="/admin/login" />;

    if (role && admin?.role !== role) {
        return <Navigate to="/admin/unauthorized" />;
    }

    return children;
};

export default AdminGuard;
export const hasPermission = (admin, permission) =>
    admin?.permissions?.includes(permission);
