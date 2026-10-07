pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

// Circuit to prove a specific Degree from an Approved Institution
template DegreeVerification() {
    // Public inputs
    signal input requestedDegree; // The required degree ID (e.g. integer representation of B.Sc. Data Science)
    signal input approvedIssuer;  // The required issuer ID/address
    signal input credentialHash;  // The Poseidon hash of the credential data

    // Private inputs
    signal input degreeId;        // The actual degree ID in the credential
    signal input issuer;          // The actual issuer ID
    signal input holder;          // Holder ID/address
    signal input credentialSecret;// Random salt

    // 1. Verify credential authenticity via Poseidon Hash
    component hasher = Poseidon(4);
    hasher.inputs[0] <== issuer;
    hasher.inputs[1] <== holder;
    hasher.inputs[2] <== degreeId;
    hasher.inputs[3] <== credentialSecret;

    credentialHash === hasher.out;

    // 2. Verify Degree Requirement
    // Ensure the degree ID matches the requested degree
    component isDegreeValid = IsEqual();
    isDegreeValid.in[0] <== degreeId;
    isDegreeValid.in[1] <== requestedDegree;
    isDegreeValid.out === 1;

    // 3. Verify Issuer Requirement
    // Ensure the issuer matches the approved issuer
    component isIssuerValid = IsEqual();
    isIssuerValid.in[0] <== issuer;
    isIssuerValid.in[1] <== approvedIssuer;
    isIssuerValid.out === 1;
}

component main {public [requestedDegree, approvedIssuer, credentialHash]} = DegreeVerification();
