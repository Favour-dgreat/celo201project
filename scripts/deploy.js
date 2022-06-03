const hre = require("hardhat");

async function main() {
  const GTASNFT = await hre.ethers.getContractFactory("GTASNFT");
  const gtasNFT = await GTASNFT.deploy();

  await gtasNFT.deployed();

  console.log("GTASNFT deployed to:", gtasNFT.address);
  storeContractData(gtasNFT)
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/GTASNFT-address.json",
    JSON.stringify({ GTASNFT: contract.address }, undefined, 2)
  );

  const GtasNFTArtifact = artifacts.readArtifactSync("GTASNFT");

  fs.writeFileSync(
    contractsDir + "/GTASNFT.json",
    JSON.stringify(GtasNFTArtifact, null, 2)
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
