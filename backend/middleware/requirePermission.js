export const requirePermission = (...permissions) => {
    return (req, res, next) => {
        const hasPermission = permissions.every(p =>
            req.admin.permissions.includes(p)
        );

        if (!hasPermission) {
            return res.status(403).json({
                message: "Access denied (permission)",
            });
        }

        next();
    };
};
