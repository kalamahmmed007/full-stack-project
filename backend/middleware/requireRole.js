export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                message: "Access denied (role)",
            });
        }
        next();
    };
};
