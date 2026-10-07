# ZK-ID: Privacy-Preserving Digital Identity & Credential Verification

ZK-ID is a complete production-quality platform for issuing, holding, and verifying digital credentials using Zero-Knowledge Proofs (ZKPs). 

> "Prove the claim. Don't reveal the data."

## Problem
Traditional identity verification exposes too much information. When you show your ID to prove you are over 18, you also reveal your exact date of birth, name, address, and ID number.

## Solution
ZK-ID lets users prove claims without revealing underlying data. Users hold their credentials privately, generate a Zero-Knowledge Proof (ZKP) to answer a specific claim (e.g., "Age >= 18" = TRUE), and present the proof to the verifier. The verifier can cryptographically verify the proof against the issuer's public commitment on the blockchain without ever seeing the private data.

## Architecture
1. **Issuer**: Approves and issues a credential (e.g., University, DMV). Signs the data and registers a Poseidon Hash commitment on-chain.
2. **Holder Wallet**: Stores the encrypted credential data locally. Generates a ZK Proof when requested.
3. **Verifier**: Requests a specific claim. Receives the ZK Proof and validates it either on-chain via smart contracts or off-chain using the verifier key.
4. **Blockchain Registry**: Smart contracts store credential validity and revocation status. No personal data is stored on-chain.

## Technology Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, SQLite (configurable to PostgreSQL)
- **Zero-Knowledge**: Circom, snarkjs, Groth16
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Web3**: wagmi, viem, RainbowKit

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the required values (or use the defaults for local testing).

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Smart Contract Deployment (Local Testnet)
```bash
npx hardhat node
# In a new terminal:
npx hardhat run scripts/deploy.ts --network localhost
```
Update your `.env` with the deployed contract addresses.

### 5. ZK Circuit Setup
```bash
node scripts/build-zk.js
```
*Note: Requires `circom` compiler to be installed on your system if you are compiling circuits from scratch.*

### 6. Run the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## Testing
```bash
# Test smart contracts
npx hardhat test

# Test frontend/backend (if configured)
npm run test
```

## Security & Privacy Model
- **No Private Data On-Chain**: Only Poseidon hashes (commitments) are stored on the blockchain.
- **Revocation**: Handled via `RevocationRegistry` smart contract. A revoked credential will fail any subsequent verification.
- **Threat Model**: Assumes the issuer is trusted to issue valid data. Assumes the cryptography (Groth16/Poseidon) is secure.

## Documentation
- [Architecture](docs/architecture.md)
- [Security](docs/security.md)
- [Privacy](docs/privacy.md)
- [Circuits](docs/circuits.md)
