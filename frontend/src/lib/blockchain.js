import { ethers } from "ethers";
import CarbonCreditTokenABI from "./abis/CarbonCreditToken.json";
import CarbonMarketplaceABI from "./abis/CarbonMarketplace.json";

// Hardhat Account #0 — publicly known test key, safe for local only
const HARDHAT_RPC = "http://127.0.0.1:8545";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Paste addresses after running deploy script
const TOKEN_ADDRESS = "PASTE_AFTER_DEPLOY";
const MARKETPLACE_ADDRESS = "PASTE_AFTER_DEPLOY";

const provider = new ethers.JsonRpcProvider(HARDHAT_RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

export const tokenContract = new ethers.Contract(TOKEN_ADDRESS, CarbonCreditTokenABI, signer);
export const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, CarbonMarketplaceABI, signer);
export const walletAddress = signer.address;
// → 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
