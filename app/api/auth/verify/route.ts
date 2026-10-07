import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { db } from '@/lib/db';
import { getStoredNonce, clearNonce } from '../nonce/route';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address, signature, message } = body;

        if (!address || !signature || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Recover address from signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Verify nonce if we used a strict nonce system. For demo, we just verify they signed the message.
        // In production, we'd check `getStoredNonce(address) === expectedNonceInMessage`

        let user = await db.user.findUnique({
            where: { walletAddress: address.toLowerCase() }
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    walletAddress: address.toLowerCase(),
                }
            });
        }

        // In a real app we'd set a JWT cookie here
        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error("Auth verify error:", error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
