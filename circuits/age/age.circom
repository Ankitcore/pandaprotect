pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

// Circuit to prove Age >= 18 without revealing Date of Birth
template AgeVerification() {
    // Public inputs
    signal input currentDate; // Format: YYYYMMDD
    signal input minimumAge;  // e.g. 18
    signal input credentialHash; // The Poseidon hash of the credential data

    // Private inputs
    signal input dateOfBirth; // Format: YYYYMMDD
    signal input issuer;      // Issuer ID/address
    signal input holder;      // Holder ID/address
    signal input credentialSecret; // Random salt

    // 1. Verify credential authenticity via Poseidon Hash
    component hasher = Poseidon(4);
    hasher.inputs[0] <== issuer;
    hasher.inputs[1] <== holder;
    hasher.inputs[2] <== dateOfBirth;
    hasher.inputs[3] <== credentialSecret;

    credentialHash === hasher.out;

    // 2. Verify Age Requirement
    // We check if (currentDate - dateOfBirth) >= (minimumAge * 10000)
    // E.g., 20261007 - 20081007 = 180000. 18 * 10000 = 180000. 180000 >= 180000 (True)
    component ageDiffCalc = GreaterEqThan(32);
    
    // Check if the currentDate is greater than dateOfBirth to avoid underflow
    component validDateCalc = GreaterEqThan(32);
    validDateCalc.in[0] <== currentDate;
    validDateCalc.in[1] <== dateOfBirth;
    validDateCalc.out === 1;

    ageDiffCalc.in[0] <== currentDate - dateOfBirth;
    ageDiffCalc.in[1] <== minimumAge * 10000;
    
    ageDiffCalc.out === 1;
}

component main {public [currentDate, minimumAge, credentialHash]} = AgeVerification();
