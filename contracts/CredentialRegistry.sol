// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialRegistry is Ownable {
    struct Credential {
        bytes32 credentialHash;
        address holder;
        address issuer;
        uint256 issuedAt;
        uint256 expiresAt;
        bool isValid;
    }

    mapping(bytes32 => Credential) public credentials;
    mapping(address => bool) public approvedIssuers;

    event CredentialIssued(bytes32 indexed credentialHash, address indexed holder, address indexed issuer);
    event CredentialStatusUpdated(bytes32 indexed credentialHash, bool isValid);
    event IssuerStatusUpdated(address indexed issuer, bool isApproved);

    error UnauthorizedIssuer();
    error CredentialAlreadyExists();
    error CredentialNotFound();

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyApprovedIssuer() {
        if (!approvedIssuers[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedIssuer();
        }
        _;
    }

    function setIssuerStatus(address issuer, bool isApproved) external onlyOwner {
        approvedIssuers[issuer] = isApproved;
        emit IssuerStatusUpdated(issuer, isApproved);
    }

    function issueCredential(
        bytes32 credentialHash,
        address holder,
        uint256 expiresAt
    ) external onlyApprovedIssuer {
        if (credentials[credentialHash].issuedAt != 0) {
            revert CredentialAlreadyExists();
        }

        credentials[credentialHash] = Credential({
            credentialHash: credentialHash,
            holder: holder,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            isValid: true
        });

        emit CredentialIssued(credentialHash, holder, msg.sender);
    }

    function isCredentialValid(bytes32 credentialHash) external view returns (bool) {
        Credential memory cred = credentials[credentialHash];
        return cred.isValid && (cred.expiresAt == 0 || block.timestamp <= cred.expiresAt);
    }

    function updateCredentialStatus(bytes32 credentialHash, bool isValid) external {
        Credential storage cred = credentials[credentialHash];
        if (cred.issuedAt == 0) {
            revert CredentialNotFound();
        }
        if (cred.issuer != msg.sender && msg.sender != owner()) {
            revert UnauthorizedIssuer();
        }

        cred.isValid = isValid;
        emit CredentialStatusUpdated(credentialHash, isValid);
    }
}
