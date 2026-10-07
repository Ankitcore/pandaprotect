import crypto from 'crypto';
import { buildPoseidon } from 'circomlibjs';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export function generateNonce() {
    return crypto.randomBytes(16).toString('hex');
}

export async function generateCredentialHash(issuer: string, holder: string, dataInt: string, secret: string) {
    const poseidon = await buildPoseidon();
    const hash = poseidon([
        BigInt(issuer),
        BigInt(holder),
        BigInt(dataInt),
        BigInt(secret)
    ]);
    return poseidon.F.toString(hash);
}
