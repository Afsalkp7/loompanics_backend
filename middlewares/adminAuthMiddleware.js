import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (process.env.adminId == decoded.id) {
            req.user = decoded.id;
            next();
        }else{
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};