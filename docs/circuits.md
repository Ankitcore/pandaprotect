# ZK-ID Circuit Design Notes

## 1. Age Verification Circuit (`age.circom`)

**Goal**: Prove `Age >= MinimumAge` without revealing Date of Birth.

### Inputs
- **Private**:
  - `dateOfBirth` (Format: YYYYMMDD)
  - `issuer` (Address/ID)
  - `holder` (Address/ID)
  - `credentialSecret` (Random salt)
- **Public**:
  - `currentDate` (Format: YYYYMMDD)
  - `minimumAge` (Integer, e.g., 18)
  - `credentialHash` (Poseidon Hash of the credential data)

### Outputs
- Implicit output: Boolean True/False that constraints are satisfied.

### Constraints
1. `Poseidon(issuer, holder, dateOfBirth, credentialSecret) == credentialHash`
2. `currentDate - dateOfBirth >= minimumAge * 10000`

### Privacy Properties
- The Verifier only learns that the statement is true. The exact `dateOfBirth` is obfuscated by the ZKP.

---

## 2. Degree Verification Circuit (`degree.circom`)

**Goal**: Prove ownership of a specific degree from an approved institution.

### Inputs
- **Private**:
  - `degreeId` (Integer ID of the degree)
  - `issuer`
  - `holder`
  - `credentialSecret`
- **Public**:
  - `requestedDegree` (The required degree ID)
  - `approvedIssuer` (The required issuer)
  - `credentialHash` (Poseidon Hash)

### Constraints
1. `Poseidon(issuer, holder, degreeId, credentialSecret) == credentialHash`
2. `degreeId == requestedDegree`
3. `issuer == approvedIssuer`

### Privacy Properties
- The Verifier knows the `requestedDegree` and `approvedIssuer` (since they requested it), but they do not learn the holder's internal IDs or any other metadata contained in the credential.
