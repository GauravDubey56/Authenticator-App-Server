import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, ENC_TOKEN} from './config';
import * as crypto from 'crypto';
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
export const decodeJwtToken = (token: string): ServiceResponse => {
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
export const generateAccessId = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = length || 10;
    let accessId = '';
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        accessId += characters[randomIndex];
    }
    return accessId;
}
export const encryptAes = (text: string, key: string) => {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
export const decryptAes = (encryptedText: string, key: string) => {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}
export const generateAccessIdAndKey = (accessId: string | undefined): AccessKey => {
    if(!accessId) {
        accessId = generateAccessId(10);
    }
    const accessKey = encryptAes(accessId, ENC_TOKEN);
    const response = {
        AccessKeyId: accessId,
        AccessKey: accessKey
    }
    return response;
}