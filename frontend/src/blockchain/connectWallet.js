import { ethers } from "ethers";
import { carbonTokenAbi, carbonMarketplaceAbi } from "./contractABI";
import { TOKEN_ADDRESS, MARKETPLACE_ADDRESS } from "./contractConfig";

export async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask not found! Please install it.");
        return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return { provider, signer, account: accounts[0] };
}

export async function getContracts(signer) {
    const token = new ethers.Contract(TOKEN_ADDRESS, carbonTokenAbi, signer);
    const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, carbonMarketplaceAbi, signer);
    return { token, marketplace };
}
