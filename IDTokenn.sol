// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleURIStore {
    // Mapping to store URIs (avoids duplicates for most common cases)
    mapping(uint => string) public uris;
    // Event emitted when a URI is set
    event URIUpdated(uint indexed identifier, string uri);

    // Function to set the URI for an identifier
    function setURI(uint identifier, string memory uri) public {
        uris[identifier] = uri;
        emit URIUpdated(identifier, uri);
    }

    // Function to retrieve the URI for an identifier (view function for gas optimization)
    function getURI(uint identifier) public view returns (string memory) {
        return uris[identifier];
    }
}
