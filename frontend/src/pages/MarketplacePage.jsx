import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../blockchain/connectWallet";
import { FaStore, FaTag, FaShoppingCart, FaTimes } from "react-icons/fa";
import "./MarketplacePage.css";

const MarketplacePage = ({ signer, account }) => {
  const [listings, setListings] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  useEffect(() => {
    if (signer && account) loadData();
  }, [signer, account]);

  const loadData = async () => {
    try {
      const { token, marketplace } = await getContracts(signer);
      const bal = await token.balances(account);
      setBalance(Number(bal));
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
    if (!signer) return showStatus("Connect wallet first!", "error");
    setLoading(true);
    try {
      const { token, marketplace } = await getContracts(signer);
      const amt = parseInt(amount);
      const priceWei = ethers.parseEther(price);
      showStatus("Approving credits...", "info");
      const approveTx = await token.approve(marketplace.target, amt);
      await approveTx.wait();
      showStatus("Creating listing...", "info");
      const tx = await marketplace.listCreditsForSale(amt, priceWei);
      await tx.wait();
      showStatus("Listing created successfully!", "success");
      setAmount("");
      setPrice("");
      await loadData();
    } catch (e) {
      showStatus("Error: " + e.message.slice(0, 60), "error");
    }
    setLoading(false);
  };

  const handleBuy = async (listing) => {
    if (!signer) return showStatus("Connect wallet first!", "error");
    setLoading(true);
    try {
      const { marketplace } = await getContracts(signer);
      showStatus("Processing purchase...", "info");
      const tx = await marketplace.buyCredits(Number(listing.id), {
        value: listing.price,
      });
      await tx.wait();
      showStatus("Purchase successful! 🎉", "success");
      await loadData();
    } catch (e) {
      showStatus("Error: " + e.message.slice(0, 60), "error");
    }
    setLoading(false);
  };

  if (!account) {
    return (
      <div className="not-connected">
        <FaStore className="not-connected-icon" />
        <h2>Connect Your Wallet</h2>
        <p>Please connect MetaMask to access the marketplace</p>
      </div>
    );
  }

  return (
    <div className="marketplace">
      {status.msg && (
        <div className={`status-banner ${status.type}`}>
          {status.msg}
        </div>
      )}

      <div className="marketplace-header">
        <div>
          <h1>Marketplace</h1>
          <p className="account-label">Your balance: <span>{balance} CCT</span></p>
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
                      {listing.seller.toLowerCase() !== account.toLowerCase() && (
                        <button
                          className="buy-btn"
                          onClick={() => handleBuy(listing)}
                          disabled={loading}
                        >
                          Buy
                        </button>
                      )}
                      {listing.seller.toLowerCase() === account.toLowerCase() && (
                        <span className="your-listing">Your listing</span>
                      )}
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
