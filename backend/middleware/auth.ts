import express from 'express';
const { Request, Response, NextFuncton } = express;
import jwt from "jsonwebtoken";

interface User {
    _id: string;
    username: string;
}

const authenticateToken = (req: Request, res: Response, next: NextFuncton) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({message: 'no token found'});
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user as User;
        next();
    })
}

export default authenticateToken;