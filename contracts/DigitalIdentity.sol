// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18; // Ensure this matches your Truffle compiler settings

contract DigitalIdentity {
    struct Identity {
        address owner; // The Ethereum address owning this identity
        string name;
        string email;
        // Add more fields as needed, e.g., profilePictureCID, etc.
        bool isRegistered;
    }

    // Mapping from an address to their Identity struct
    mapping(address => Identity) public identities;

    // Event to log when a new identity is registered
    event IdentityRegistered(
        address indexed owner,
        string name,
        string email
    );

    // Event to log when an identity is updated
    event IdentityUpdated(
        address indexed owner,
        string newName,
        string newEmail
    );

    // Modifier to check if the caller has already registered an identity
    modifier notAlreadyRegistered() {
        require(!identities[msg.sender].isRegistered, "Identity: Address already registered.");
        _;
    }

    // Modifier to check if the caller has a registered identity
    modifier isRegistered() {
        require(identities[msg.sender].isRegistered, "Identity: Address not registered.");
        _;
    }

    /**
     * @dev Registers a new digital identity for the caller (msg.sender).
     * @param _name The name associated with the identity.
     * @param _email The email associated with the identity.
     */
    function registerIdentity(string memory _name, string memory _email)
        public
        notAlreadyRegistered
    {
        identities[msg.sender] = Identity({
            owner: msg.sender,
            name: _name,
            email: _email,
            isRegistered: true
        });

        emit IdentityRegistered(msg.sender, _name, _email);
    }

    /**
     * @dev Updates the digital identity for the caller (msg.sender).
     * @param _newName The new name to set.
     * @param _newEmail The new email to set.
     */
    function updateIdentity(string memory _newName, string memory _newEmail)
        public
        isRegistered
    {
        identities[msg.sender].name = _newName;
        identities[msg.sender].email = _newEmail;

        emit IdentityUpdated(msg.sender, _newName, _newEmail);
    }

    /**
     * @dev Retrieves the identity details for a given owner address.
     * @param _owner The address of the identity owner.
     * @return name The name of the identity owner.
     * @return email The email of the identity owner.
     * @return isRegistered_ True if the identity is registered, false otherwise.
     */
    function getIdentity(address _owner)
        public
        view
        returns (
            string memory name,
            string memory email,
            bool isRegistered_
        )
    {
        Identity storage id = identities[_owner];
        return (id.name, id.email, id.isRegistered);
    }

    /**
     * @dev Checks if an address has a registered identity.
     * @param _owner The address to check.
     * @return True if registered, false otherwise.
     */
    function isIdentityRegistered(address _owner) public view returns (bool) {
        return identities[_owner].isRegistered;
    }
}