const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("PetAdoption", function () {
  async function deployContractFixture() {
    const PET_COUNT = 5;
    const ADOPTED_PET_IDX = 0;
    const [owner, account2, account3] = await ethers.getSigners();
    const PetAdoption = await ethers.getContractFactory("PetAdoption");
    const contract = await PetAdoption.deploy(PET_COUNT);

    await contract.connect(account3).adoptPet(ADOPTED_PET_IDX);

    return {
      owner,
      account2,
      account3,
      contract,
      petsAddedCount: PET_COUNT,
      adoptedPetIdx: ADOPTED_PET_IDX,
    };
  }

  describe("Test_Deployment", function () {
    it("should set the right owner", async () => {
      const { owner, contract } = await loadFixture(deployContractFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should return the right owner", async () => {
      const { owner, contract } = await loadFixture(deployContractFixture);
      const contractOwner = await contract.getOwner();
      expect(await contract.owner()).to.equal(contractOwner);
    });
  });

  describe("Add a new pet", () => {
    it("should revert with right error in case of other account", async () => {
      const { owner, contract, account2 } = await loadFixture(
        deployContractFixture
      );
      await expect(contract.connect(account2).addPet()).to.be.revertedWith(
        "Only contract owner can add a new pet"
      );
    });

    it("Should increase petIndex", async () => {
      const { owner, contract, petsAddedCount } = await loadFixture(
        deployContractFixture
      );
      await contract.connect(owner).addPet();
      expect(await contract.petIndex()).to.equal(petsAddedCount + 1);
    });
  });

  describe("Adopt Pet", () => {
    it("should revert with Pet index out of bound!", async () => {
      const { contract, petsAddedCount } = await loadFixture(
        deployContractFixture
      );

      await expect(contract.adoptPet(petsAddedCount)).to.be.revertedWith(
        "Pet index out of bound!"
      );
      await expect(contract.adoptPet(-1)).to.be.rejectedWith(
        "value out-of-bounds"
      );
    });

    it("should revert with pet is already adopted", async () => {
      const { contract, adoptedPetIdx } = await loadFixture(
        deployContractFixture
      );

      await expect(contract.adoptPet(adoptedPetIdx)).to.be.revertedWith(
        "Pet is already adopted"
      );
    });

    it("should adopt pet successfully", async () => {
      const { contract, account2 } = await loadFixture(deployContractFixture);
      const firstPetIdx = 1;
      const secondPetIdx = 2;

      await expect(contract.connect(account2).adoptPet(firstPetIdx)).not.to.be
        .reverted;
      await contract.connect(account2).adoptPet(secondPetIdx);

      const petOwnerAddress = await contract.petIdxToOwnerAddress(secondPetIdx);
      expect(petOwnerAddress).to.equal(account2.address);

      const petsByOwner = await contract
        .connect(account2)
        .getAllAdoptedPetsByOwner();
      const allAdoptedPets = await contract
        .connect(account2)
        .getAllAdoptedPets();

      expect(petsByOwner.length).to.equal(2);
      expect(allAdoptedPets.length).to.equal(3);
    });
  });
});
