import Link from "next/link";
import { Shield, Lock, CheckCircle, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-bold tracking-wider">ZK-ID</span>
        </div>
        <div className="flex gap-4">
          <Link href="/docs" className="hover:text-indigo-400 transition-colors">Docs</Link>
          <Link href="/demo" className="hover:text-indigo-400 transition-colors">Demo</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 mb-8 border border-indigo-500/20">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Privacy-Preserving Digital Credentials</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Prove who you are.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Reveal only what matters.
          </span>
        </h1>

        <p className="text-xl text-neutral-400 max-w-2xl mb-12">
          ZK-ID uses Zero-Knowledge Proofs to let users prove claims (like &quot;Age ≥ 18&quot;) 
          without exposing the underlying sensitive data (like Date of Birth).
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/demo" 
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
          >
            Try the Demo
          </Link>
          <Link 
            href="/wallet" 
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all"
          >
            Open Wallet
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <CheckCircle className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cryptographic Proofs</h3>
            <p className="text-neutral-400">
              Your credentials are mathematically proven without being shown. Verifiers trust math, not just your word.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <Lock className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Absolute Privacy</h3>
            <p className="text-neutral-400">
              Never share your actual date of birth or ID numbers again. Share only the necessary boolean claim.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <Cpu className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">On-Chain Verification</h3>
            <p className="text-neutral-400">
              Backed by EVM smart contracts. Credentials can be verified trustlessly and revoked instantly if needed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
