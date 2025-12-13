import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PermissionRoute = ({ permissions }) => {
    const { admin } = useSelector(state => state.admin);

    const hasPermission = permissions.every(p =>
        admin?.permissions?.includes(p)
    );

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PermissionRoute;
