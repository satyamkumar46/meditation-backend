import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) =>{

    const token = req.headers.authorization?.split('Bearer ')[1];

    if(!token){
        res.status(401).json({message:'No token'});
    }

    try {
        
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.userId=decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export default authMiddleware;