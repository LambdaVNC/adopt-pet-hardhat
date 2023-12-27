const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log("Deploying the contract with the address : " + address);

    const PETS_COUNT = 5;

    const PetAdoption = await hre.ethers.deployContract("PetAdoption", [
      PETS_COUNT,
    ]);

    await PetAdoption.waitForDeployment();

    saveContractFiles(PetAdoption);

    console.log(`The Contract deploy to the address :  ${PetAdoption.target}`);
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }
}

function saveContractFiles(contract) {
  const contractDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts"
  );

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  fs.writeFileSync(
    path.join(contractDir, `contract-address-${network.name}.json`),
    JSON.stringify({ PetAdoption: contract.target }, null, 2)
  );

  const PetAdoptionArtifact = hre.artifacts.readArtifactSync("PetAdoption");

  fs.writeFileSync(
    path.join(contractDir, "PetAdoption.json"),
    JSON.stringify(PetAdoptionArtifact, null, 2)
  );
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

// npx hardhat run --network localhost scripts/deploy.js
