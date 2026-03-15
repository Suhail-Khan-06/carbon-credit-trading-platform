import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy CarbonCreditToken
  const Token = await hre.ethers.getContractFactory("CarbonCreditToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("CarbonCreditToken deployed to:", tokenAddress);

  // Deploy CarbonMarketplace
  const Marketplace = await hre.ethers.getContractFactory("CarbonMarketplace");
  const marketplace = await Marketplace.deploy(tokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("CarbonMarketplace deployed to:", marketplaceAddress);

  // Mint 1000 CCT to deployer (Account #0) FIRST
  await token.mintCredits(deployer.address, 1000);
  console.log("Minted 1000 CCT to Account #0");

  // NOW transfer 200 to Account #1
  const account1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  await token.transfer(account1, 200);
  console.log("Transferred 200 CCT to Account #1");

  // Approve marketplace for Account #0's remaining 800 CCT
  await token.approve(marketplaceAddress, 800);
  console.log("Approved marketplace to spend 800 CCT for Account #0");

  console.log("\n--- COPY THESE INTO connectWallet.js ---");
  console.log("TOKEN_ADDRESS =", tokenAddress);
  console.log("MARKETPLACE_ADDRESS =", marketplaceAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
