import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts, getContractsForAccount, account, buyerAccount, ACCOUNTS } from "../blockchain/connectWallet";
import { FaTag, FaShoppingCart } from "react-icons/fa";
import "./MarketplacePage.css";

const MarketplacePage = ({ activeAccount }) => {
  const [listings, setListings] = useState([]);
  const [sellerBalance, setSellerBalance] = useState(0);
  const [buyerBalance, setBuyerBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  useEffect(() => {
    loadData();
  }, [activeAccount]);

  const loadData = async () => {
    try {
      const { token, marketplace } = await getContracts();
      const sBal = await token.balances(account);
      const bBal = await token.balances(buyerAccount);
      setSellerBalance(Number(sBal));
      setBuyerBalance(Number(bBal));
      const all = await marketplace.getAllListings();
      setListings(all);
    } catch (e) {
      console.error(e);
    }
  };

  const showStatus = (msg, type) => {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: "", type: "" }), 4000);
  };

  const handleList = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, marketplace } = getContractsForAccount(ACCOUNTS[activeAccount]);
      const amt = parseInt(amount);
      const priceWei = ethers.parseEther(price);

      showStatus("Approving credits...", "info");
      const approveTx = await token.approve(await marketplace.getAddress(), amt);
      await approveTx.wait();

      showStatus("Creating listing...", "info");
      const { marketplace: marketplace2 } = getContractsForAccount(ACCOUNTS[activeAccount]);
      const tx = await marketplace2.listCreditsForSale(amt, priceWei);
      await tx.wait();

      showStatus("Listing created successfully!", "success");
      setAmount("");
      setPrice("");
      await loadData();
    } catch (e) {
      console.error("Full error:", e);
      showStatus("Error: " + e.message.slice(0, 80), "error");
    }
    setLoading(false);
  };

  const handleBuy = async (listing) => {
  setLoading(true);
  try {
    // Buyer is always whoever did NOT create the listing
    const buyerKey = listing.seller.toLowerCase() === account.toLowerCase()
      ? ACCOUNTS[buyerAccount]   // seller is Account #0 → buyer is Account #1
      : ACCOUNTS[account];        // seller is Account #1 → buyer is Account #0

    const { marketplace } = getContractsForAccount(buyerKey);

    showStatus("Processing purchase...", "info");
    const tx = await marketplace.buyCredits(Number(listing.id), {
      value: listing.price,
    });
    await tx.wait();

    showStatus("Purchase successful! 🎉", "success");
    await loadData();
  } catch (e) {
    console.error("Full error:", e);
    showStatus("Error: " + e.message.slice(0, 80), "error");
  }
  setLoading(false);
};


  return (
    <div className="marketplace">
      {status.msg && (
        <div className={`status-banner ${status.type}`}>{status.msg}</div>
      )}

      <div className="marketplace-header">
        <div>
          <h1>Marketplace</h1>
          <p className="account-label">
            Account #0: <span>{sellerBalance} CCT</span> &nbsp;|&nbsp;
            Account #1: <span>{buyerBalance} CCT</span>
          </p>
        </div>
        <button className="refresh-btn" onClick={loadData} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      <div className="marketplace-grid">
        {/* List Credits Form */}
        <div className="list-form-card">
          <div className="card-header">
            <FaTag className="card-icon" />
            <h2>List Credits for Sale</h2>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Listing as: {activeAccount.slice(0, 6)}...{activeAccount.slice(-4)}
          </p>
          <form onSubmit={handleList}>
            <div className="form-group">
              <label>Amount (credits)</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Total Price (ETH)</label>
              <input
                type="text"
                placeholder="e.g. 0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "List for Sale"}
            </button>
          </form>
        </div>

        {/* Active Listings */}
        <div className="listings-card">
          <div className="card-header">
            <FaShoppingCart className="card-icon" />
            <h2>Active Listings</h2>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Buying as: {(activeAccount === account ? buyerAccount : account).slice(0, 6)}...
            {(activeAccount === account ? buyerAccount : account).slice(-4)}
          </p>

          {listings.filter((l) => l.isActive).length === 0 ? (
            <div className="empty-state">
              <p>No active listings yet</p>
              <span>Be the first to list carbon credits!</span>
            </div>
          ) : (
            <div className="listings-list">
              {listings.map((listing, i) =>
                listing.isActive ? (
                  <div key={i} className="listing-item">
                    <div className="listing-info">
                      <div className="listing-amount">
                        {Number(listing.amount)} <span>CCT</span>
                      </div>
                      <div className="listing-seller">
                        {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                      </div>
                    </div>
                    <div className="listing-right">
                      <div className="listing-price">
                        {ethers.formatEther(listing.price)} ETH
                      </div>
                      <button
                        className="buy-btn"
                        onClick={() => handleBuy(listing)}
                        disabled={loading}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
