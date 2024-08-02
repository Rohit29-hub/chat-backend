import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
const jwtSecret = "rohitkohli@1977"

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access",
                success: false,
                status: false
            })
        }
        const payload = jwt.verify(token, jwtSecret);

        // @ts-ignore
        req['user'] = payload;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Token expired",
            success: false,
            status: false
        })
    }
}
