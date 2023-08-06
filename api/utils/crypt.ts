import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config';
export const generateHash = async (password: string): Promise<string> => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}
export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid
    } catch (error) {
        return false;
    }
}

export const createJwtToken = (user: UserToken): string => {
    if (!user.TokenCreatedAt) {
        user.TokenCreatedAt = Date.now().toString();
    }
    const token = jwt.sign(user, JWT_SECRET);
    return token
}
export const decodeJwtToken = (token: string): object => {
    const res = { code: 400, message: "Invalid token", data: null };
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        res.code = 200;
        res.data = typeof payload == "string" ? JSON.parse(payload) : payload;
        res.message = "Token verified successfully";
    } catch (error) {
        res.message = "Token Expired";
    } finally {
        return res;
    }
}