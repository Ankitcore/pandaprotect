import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { encrypt, generateCredentialHash } from '@/lib/crypto';
import crypto from 'crypto';
import { z } from 'zod';

const issueSchema = z.object({
    issuerAddress: z.string(),
    holderAddress: z.string(),
    credentialType: z.string(),
    privateData: z.any() // E.g., { dateOfBirth: 'YYYYMMDD' } or { degreeId: 123 }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = issueSchema.parse(body);

        const issuerUser = await db.user.findUnique({
            where: { walletAddress: parsed.issuerAddress.toLowerCase() },
            include: { issuerProfile: true }
        });

        if (!issuerUser || !issuerUser.issuerProfile || !issuerUser.issuerProfile.isApproved) {
            return NextResponse.json({ error: 'Unauthorized issuer' }, { status: 403 });
        }

        // Generate a random secret (salt) for the credential
        const credentialSecret = crypto.randomInt(100000000, 999999999).toString();
        
        let dataInt = "0";
        if (parsed.credentialType === 'AGE') {
            dataInt = parsed.privateData.dateOfBirth;
        } else if (parsed.credentialType === 'DEGREE') {
            dataInt = parsed.privateData.degreeId;
        }

        // Calculate Poseidon Hash
        const hash = await generateCredentialHash(
            // We use simple conversions for demo. In production, address should be converted to big int safely.
            "12345", // Mocking issuer address as BigInt for Poseidon input
            "67890", // Mocking holder address as BigInt
            dataInt,
            credentialSecret
        );

        // Encrypt the private data and secret so the holder can view it
        const payloadToEncrypt = JSON.stringify({
            data: parsed.privateData,
            secret: credentialSecret,
            dataInt: dataInt
        });
        const encryptedData = encrypt(payloadToEncrypt);

        // Ensure holder exists
        let holder = await db.user.findUnique({ where: { walletAddress: parsed.holderAddress.toLowerCase() } });
        if (!holder) {
            holder = await db.user.create({ data: { walletAddress: parsed.holderAddress.toLowerCase() } });
        }

        const credential = await db.credential.create({
            data: {
                credentialHash: hash,
                holderWallet: holder.walletAddress,
                issuerId: issuerUser.issuerProfile.id,
                credentialType: parsed.credentialType,
                credentialData: encryptedData,
                credentialSecret: encrypt(credentialSecret), // Encrypted secret
            }
        });

        return NextResponse.json({ success: true, credential });
    } catch (error) {
        console.error("Issue credential error:", error);
        return NextResponse.json({ error: 'Failed to issue credential' }, { status: 500 });
    }
}
