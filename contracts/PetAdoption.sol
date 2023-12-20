//SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.19;

contract PetAdoption {
    address public owner;
    uint public petIndex = 0;
    uint[] public allAdoptedPets;

    mapping(uint => address) public petIdxToOwnerAddress;
    mapping(address => uint[]) public OwnerAddressToPetList;

    constructor(uint initialIndex) {
        owner = msg.sender;
        petIndex = initialIndex;
    }

    function addPet() public {
        require(msg.sender == owner, "Only contract owner can add a new pet");
        petIndex++;
    }

    function adoptPet(uint adoptIdx) public {
        require(adoptIdx < petIndex, "Pet index out of bound!");
        require(
            petIdxToOwnerAddress[adoptIdx] == address(0),
            "Pet is already adopted"
        );

        petIdxToOwnerAddress[adoptIdx] = msg.sender;
        OwnerAddressToPetList[msg.sender].push(adoptIdx);
        allAdoptedPets.push(adoptIdx);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getAllAdoptedPetsByOwner() public view returns (uint[] memory) {
        return OwnerAddressToPetList[msg.sender];
    }

    function getAllAdoptedPets() public view returns (uint[] memory) {
        return allAdoptedPets;
    }
}
