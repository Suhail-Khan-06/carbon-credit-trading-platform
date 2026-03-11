# Carbon Credit Trading Platform

Decentralized platform for companies to buy/sell carbon credits using Ethereum smart contracts.

## Features

- Admin mints carbon credits to companies
- Companies list credits for sale
- Buy credits from marketplace
- View owned credits and transaction history
- React frontend with MetaMask

## Tech Stack

- **Solidity** (smart contracts)
- **Remix IDE** (compile/deploy)
- **React + Ethers.js** (frontend)
- **MetaMask** (wallet)

## Quick Start

### 1. Deploy Smart Contracts (Remix)

1. Go to https://remix.ethereum.org

2. Copy CarbonCreditToken.sol → contracts/

3. Copy CarbonMarketplace.sol → contracts/

4. Compile both contracts

5. Deploy CarbonCreditToken (Remix VM)

6. Deploy CarbonMarketplace (paste token address)

### 2. Run Frontend

cd frontend
npm install
npm run dev

### 3. Test Flow

1. Admin: mintCredits(companyA, 100)

2. CompanyA: approve(marketplace, 50)

3. CompanyA: listCreditsForSale(50, 0.1 ETH)

4. CompanyB: buyCredits(0)

## Folder Structure

carbon-credit-trading-platform/
├── smart-contracts/ # Solidity contracts
├── frontend/ # React app
└── docs/ # Documentation

## Next Phase

**Phase 2**: Create `CarbonCreditToken.sol` in Remix and test minting.

---

**Made by [Your Name] for Blockchain Course**
