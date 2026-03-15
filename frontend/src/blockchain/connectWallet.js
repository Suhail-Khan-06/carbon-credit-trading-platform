import { ethers } from "ethers";
import CarbonCreditTokenABI from "./abis/CarbonCreditToken.json";
import CarbonMarketplaceABI from "./abis/CarbonMarketplace.json";

const HARDHAT_RPC = "http://127.0.0.1:8545";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const provider = new ethers.JsonRpcProvider(HARDHAT_RPC);
export const signer = new ethers.Wallet(PRIVATE_KEY, provider);
export const account = signer.address;
export const buyerSigner = new ethers.Wallet(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  new ethers.JsonRpcProvider(HARDHAT_RPC)
);
export const buyerAccount = buyerSigner.address;

export function getContractsForAccount(privateKey) {
  const freshProvider = new ethers.JsonRpcProvider(HARDHAT_RPC);
  const freshSigner = new ethers.Wallet(privateKey, freshProvider);
  const token = new ethers.Contract(TOKEN_ADDRESS, CarbonCreditTokenABI.abi, freshSigner);
  const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, CarbonMarketplaceABI.abi, freshSigner);
  return { token, marketplace };
}

export const ACCOUNTS = {
  [account]: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  [buyerAccount]: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
};

export async function getContracts() {
  const freshProvider = new ethers.JsonRpcProvider(HARDHAT_RPC);
  const freshSigner = new ethers.Wallet(PRIVATE_KEY, freshProvider);
  
  // Force fetch latest nonce from chain
  const nonce = await freshProvider.getTransactionCount(freshSigner.address, "latest");
  console.log("Current nonce:", nonce);

  const token = new ethers.Contract(TOKEN_ADDRESS, CarbonCreditTokenABI.abi, freshSigner);
  const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, CarbonMarketplaceABI.abi, freshSigner);
  return { token, marketplace };
}