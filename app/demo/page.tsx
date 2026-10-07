'use client';

import { useState } from 'react';
import { Shield, ArrowRight, User, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
    const [step, setStep] = useState(0);
    const [credential, setCredential] = useState<any>(null);
    const [proofStatus, setProofStatus] = useState<'pending' | 'success' | 'failed'>('pending');

    const issueDemoCredential = async () => {
        setStep(1);
        try {
            // In a real app we'd call our API. For the demo we simulate the delay.
            setTimeout(() => {
                setCredential({
                    id: "cred_" + Math.random().toString(36).substring(7),
                    type: "AGE",
                    hash: "0x123...abc",
                    issuer: "0xDemoUniversity..."
                });
                setStep(2);
            }, 1500);
        } catch (e) {
            console.error(e);
        }
    };

    const verifyProof = () => {
        setStep(3);
        setTimeout(() => {
            setProofStatus('success');
            setStep(4);
        }, 2000);
    };

    const revokeAndVerify = () => {
        setStep(5);
        setTimeout(() => {
            setProofStatus('failed');
            setStep(6);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-indigo-400 hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                <h1 className="text-3xl font-bold mb-8">Interactive Demo Flow</h1>

                <div className="space-y-8">
                    {/* Step 1: Issuer */}
                    <div className={`p-6 border rounded-xl ${step >= 0 ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 opacity-50'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <User className="text-indigo-400" />
                            <h2 className="text-xl font-semibold">1. University Issues Credential</h2>
                        </div>
                        <p className="text-neutral-400 mb-4">The university issues a digital identity credential to a student.</p>
                        {step === 0 && (
                            <button onClick={issueDemoCredential} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                                Issue Demo Credential
                            </button>
                        )}
                        {step === 1 && <p className="text-indigo-400 animate-pulse">Generating Zero-Knowledge Commitment...</p>}
                        {step >= 2 && credential && (
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-green-400">
                                ✓ Credential Issued: {credential.id} <br />
                                ✓ Commitment Hash: {credential.hash}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Verification */}
                    <div className={`p-6 border rounded-xl ${step >= 2 ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10 opacity-50'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-cyan-400" />
                            <h2 className="text-xl font-semibold">2. Verify Claim (Age ≥ 18)</h2>
                        </div>
                        <p className="text-neutral-400 mb-4">A bar requests proof of age. The student generates a ZK proof.</p>
                        {step === 2 && (
                            <button onClick={verifyProof} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors">
                                Generate & Verify ZK Proof
                            </button>
                        )}
                        {step === 3 && <p className="text-cyan-400 animate-pulse">Generating Groth16 Snark Proof...</p>}
                        {step >= 4 && (
                            <div className={`p-4 rounded-lg font-mono text-sm ${proofStatus === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                {proofStatus === 'success' ? (
                                    <>
                                        <CheckCircle className="inline w-5 h-5 mb-1 mr-2" />
                                        PROOF VALID: User is over 18. (DOB Hidden)
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="inline w-5 h-5 mb-1 mr-2" />
                                        PROOF INVALID: Credential Revoked.
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Step 3: Revocation */}
                    <div className={`p-6 border rounded-xl ${step >= 4 ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 opacity-50'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <XCircle className="text-red-400" />
                            <h2 className="text-xl font-semibold">3. Revocation</h2>
                        </div>
                        <p className="text-neutral-400 mb-4">The university revokes the credential due to a policy violation.</p>
                        {step === 4 && (
                            <button onClick={revokeAndVerify} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
                                Revoke & Re-verify
                            </button>
                        )}
                        {step === 5 && <p className="text-red-400 animate-pulse">Updating blockchain state...</p>}
                        {step >= 6 && (
                            <div className="bg-red-500/10 p-4 rounded-lg text-sm text-red-400 border border-red-500/30">
                                ✕ Credential revoked on-chain. Verification now fails.
                            </div>
                        )}
                    </div>
                    
                    {step >= 6 && (
                        <div className="text-center pt-8">
                            <p className="text-neutral-400 mb-4">Demo complete. For the real app, use the wallet and issuer portals.</p>
                            <Link href="/wallet" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
                                Go to Real Wallet
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
