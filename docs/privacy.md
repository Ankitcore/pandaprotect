# Information Disclosure Matrix

ZK-ID follows the principle of least privilege for data disclosure.

| Data | Issuer | Holder | Verifier | Blockchain |
|---|---|---|---|---|
| Name | ✓ | ✓ | ✕ | ✕ |
| DOB | ✓ | ✓ | ✕ | ✕ |
| Degree | ✓ | ✓ | Claim only | ✕ |
| Student ID | ✓ | ✓ | ✕ | ✕ |
| Credential Hash | ✓ | ✓ | ✓ | ✓ |
| Revocation Status | ✓ | ✓ | ✓ | ✓ |
| ZK Proof | — | ✓ | ✓ | Optional |

## Key Privacy Takeaways
- **Blockchain**: Stores only cryptographic commitments (Poseidon hashes) and boolean flags (revoked/valid). Never stores plaintext personal data.
- **Verifier**: Only receives a Zero-Knowledge proof and public signals (e.g., minimum age, credential hash). Does not see the private inputs used to generate the proof.
- **Issuer**: Has access to the data they issue, but cannot track when or where the user presents the credential (unless the verification process is on-chain and they monitor the holder's address, which can be mitigated by using relayer networks or ephemeral verification addresses).
