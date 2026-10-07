# System Architecture

## Components

1. **Frontend (Next.js)**:
   - `/issuer`: Dashboard for institutions to issue and manage credentials.
   - `/wallet`: User interface to store credentials and generate proofs.
   - `/verifier`: Interface for third parties to request proofs and verify them.

2. **Backend (Next.js API)**:
   - REST endpoints for DB operations, encryption, and off-chain ZK verification.
   - Interfaces with SQLite/PostgreSQL via Prisma.

3. **Smart Contracts (Solidity)**:
   - `CredentialRegistry`: Tracks issued credentials (Hashes only).
   - `RevocationRegistry`: Tracks revoked credentials.
   - (Optional) `ZKVerifier`: On-chain proof verification.

4. **Zero-Knowledge Circuits (Circom)**:
   - Defines the logic that must be proven (e.g., Age >= 18).
   - Compiled to WebAssembly for fast client-side proof generation in the browser.

## Data Flow (Issuance)
`Issuer Form -> Backend (Encrypts & Hashes) -> DB (Storage) -> Smart Contract (Commitment)`

## Data Flow (Verification)
`Verifier Request -> QR Code -> Wallet Scans -> Wallet Generates ZKP (Client-side) -> Verifier API -> Verification Result`
