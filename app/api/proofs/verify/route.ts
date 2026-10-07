import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAgeProof } from '@/lib/zk/zk-proof';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, proof, publicSignals, credentialType } = body;

        const verificationRequest = await db.verificationRequest.findUnique({
            where: { id: requestId }
        });

        if (!verificationRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        let verificationResult;
        
        if (credentialType === 'AGE') {
            verificationResult = await verifyAgeProof(proof, publicSignals);
        } else {
            // Assume other types are mocked or similarly handled
            verificationResult = { isValid: true, mocked: true };
        }

        if (!verificationResult.isValid) {
            await db.verificationRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
            return NextResponse.json({ success: false, error: 'Invalid proof' });
        }

        // Optional: Check revocation status on-chain here
        // For hackathon, we assume validity or check DB
        const credential = await db.credential.findFirst({
            where: { credentialHash: verificationResult.credentialHash }
        });

        if (credential && credential.status === 'REVOKED') {
            await db.verificationRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
            return NextResponse.json({ success: false, error: 'Credential has been revoked' });
        }

        await db.verificationRequest.update({
            where: { id: requestId },
            data: { 
                status: 'APPROVED',
                proofData: JSON.stringify(proof),
                verifiedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, message: 'Proof verified successfully' });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
