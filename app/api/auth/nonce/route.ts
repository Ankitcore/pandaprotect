import { NextResponse } from 'next/server';
import { generateNonce } from '@/lib/crypto';

// In a real app, this should be stored in a DB or Redis with an expiration
const nonceStore: Record<string, string> = {};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const nonce = generateNonce();
    nonceStore[address.toLowerCase()] = nonce;
    
    // For demo, we are returning it, but typically the frontend asks for it and we return it.
    // In our quick implementation, we will accept any valid signature of a specific message to keep it simple,
    // or we use the nonce properly. Let's return the nonce.
    return NextResponse.json({ nonce });
}

export function getStoredNonce(address: string) {
    return nonceStore[address.toLowerCase()];
}

export function clearNonce(address: string) {
    delete nonceStore[address.toLowerCase()];
}
