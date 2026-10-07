# Security Model

## Threat Model
1. **Malicious Issuer**: An issuer could issue fake credentials. Mitigation: `CredentialRegistry` only allows `approvedIssuers` to issue credentials. Verifiers specify which issuers they trust.
2. **Malicious Holder**: A holder could attempt to forge a proof. Mitigation: The underlying cryptography (Groth16 + Poseidon) ensures that forging a proof for a valid hash without knowing the pre-image is computationally infeasible.
3. **Revoked Credentials**: A holder attempts to use a revoked credential. Mitigation: The verifier checks the `RevocationRegistry` before accepting a proof.

## Cryptography
- **Hashing**: Poseidon is used because it is highly efficient inside SNARK circuits compared to SHA256 or Keccak256.
- **ZKPs**: Groth16 is used for its small proof size and fast verification time.

## Smart Contract Security
- Uses OpenZeppelin's `Ownable` for access control.
- State-changing functions are protected by modifiers (`onlyApprovedIssuer`, `onlyApprovedRevoker`).
- Protection against duplicate credential issuance.

## Operational Security
- Private keys are never stored on the frontend.
- API endpoints require wallet signatures (nonces) for sensitive actions.
- Encrypted data at rest in the database using AES-256-CBC.
