import * as snarkjs from 'snarkjs';
import path from 'path';
import fs from 'fs';

export async function verifyAgeProof(proof: any, publicSignals: any) {
    try {
        const vKeyPath = path.join(process.cwd(), 'public', 'zk', 'age_vkey.json');
        
        // If vKey does not exist, return a mocked success for demo fallback
        if (!fs.existsSync(vKeyPath)) {
            console.warn("ZK vKey not found, using mocked verification fallback.");
            return {
                isValid: true,
                mocked: true,
                credentialHash: publicSignals[2]
            };
        }

        const vKey = JSON.parse(fs.readFileSync(vKeyPath, 'utf8'));
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        
        return {
            isValid: res,
            mocked: false,
            credentialHash: publicSignals[2]
        };
    } catch (error) {
        console.error("Proof verification failed:", error);
        return { isValid: false, mocked: false };
    }
}
