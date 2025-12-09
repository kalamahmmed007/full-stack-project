import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id; // better than req.body overwrite

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default auth;
