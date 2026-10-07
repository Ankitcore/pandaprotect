// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RevocationRegistry is Ownable {
    mapping(bytes32 => bool) public revoked;
    mapping(address => bool) public approvedRevokers;

    event CredentialRevoked(bytes32 indexed credentialHash, address indexed revoker);
    event CredentialRestored(bytes32 indexed credentialHash, address indexed revoker);
    event RevokerStatusUpdated(address indexed revoker, bool isApproved);

    error UnauthorizedRevoker();
    error AlreadyRevoked();
    error NotRevoked();

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyApprovedRevoker() {
        if (!approvedRevokers[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedRevoker();
        }
        _;
    }

    function setRevokerStatus(address revoker, bool isApproved) external onlyOwner {
        approvedRevokers[revoker] = isApproved;
        emit RevokerStatusUpdated(revoker, isApproved);
    }

    function revokeCredential(bytes32 credentialHash) external onlyApprovedRevoker {
        if (revoked[credentialHash]) {
            revert AlreadyRevoked();
        }
        revoked[credentialHash] = true;
        emit CredentialRevoked(credentialHash, msg.sender);
    }

    function restoreCredential(bytes32 credentialHash) external onlyApprovedRevoker {
        if (!revoked[credentialHash]) {
            revert NotRevoked();
        }
        revoked[credentialHash] = false;
        emit CredentialRestored(credentialHash, msg.sender);
    }

    function isRevoked(bytes32 credentialHash) external view returns (bool) {
        return revoked[credentialHash];
    }
}
