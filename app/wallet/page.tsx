'use client';

import { Shield, Clock, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <nav className="flex justify-between items-center mb-12">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-indigo-500" />
                        My ZK Wallet
                    </h1>
                    <Link href="/" className="text-neutral-400 hover:text-white">Home</Link>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Credential Card */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <CheckCircle className="text-green-400 w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-medium text-indigo-400 mb-1">CREDENTIAL</h3>
                        <h2 className="text-2xl font-bold mb-6">Age Verification</h2>
                        
                        <div className="space-y-2 text-sm text-neutral-300">
                            <p><span className="text-neutral-500">Issuer:</span> Example University</p>
                            <p><span className="text-neutral-500">Issued:</span> 01 October 2026</p>
                            <p><span className="text-neutral-500">Status:</span> Valid</p>
                        </div>
                        
                        <div className="mt-8 pt-4 border-t border-white/10 flex gap-4">
                            <Link href="/demo" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors">
                                Prove Claim
                            </Link>
                        </div>
                    </div>

                    {/* Placeholder Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-neutral-500 border-dashed">
                        <Info className="w-8 h-8 mb-2 opacity-50" />
                        <p>No other credentials found.</p>
                        <p className="text-xs mt-2">Request an institution to issue you a new ZK credential.</p>
                    </div>
                </div>

                <div className="mt-12 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-start gap-4">
                    <Shield className="text-indigo-400 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-semibold text-indigo-100">Privacy Notice</h4>
                        <p className="text-sm text-indigo-200/70 mt-1">
                            This wallet stores your credential data locally. When you prove a claim, the actual data is never sent to the verifier—only a cryptographic Zero-Knowledge Proof.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
