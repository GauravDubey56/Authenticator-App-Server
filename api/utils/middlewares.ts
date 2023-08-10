import { NextFunction } from "express";
import { decodeJwtToken } from "./crypt";
export const authorizeUser = async (req: ProtectedRequest, res: any, next: NextFunction) => {
    try {
        const token: string = req.headers.get('authorization') || '';
        const decodeToken = decodeJwtToken(token);
        if (decodeToken.code == 200) {
            req.user = decodeToken.data;
            next();
        } else {
            return res.status(401).json({
                error: "Unauthorized access"
            })
        }

    } catch (error) {
        next(error)
    }
}