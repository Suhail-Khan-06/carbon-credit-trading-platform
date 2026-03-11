import { useEffect, useState } from "react";
import { getContracts } from "../blockchain/connectWallet";
import { FaLeaf, FaStore, FaExchangeAlt, FaWallet } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = ({ signer, account }) => {
  const [balance, setBalance] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer && account) loadData();
  }, [signer, account]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { token, marketplace } = await getContracts(signer);
      const bal = await token.balances(account);
      setBalance(Number(bal));
      const listings = await marketplace.getAllListings();
      setTotalListings(listings.length);
      setActiveListings(listings.filter((l) => l.isActive).length);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!account) {
    return (
      <div className="not-connected">
        <FaLeaf className="not-connected-icon" />
        <h2>Connect Your Wallet</h2>
        <p>Please connect MetaMask to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="account-label">
            {account.slice(0, 8)}...{account.slice(-6)}
          </p>
        </div>
        <button className="refresh-btn" onClick={loadData} disabled={loading}>
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <FaLeaf />
          </div>
          <div className="stat-info">
            <p className="stat-label">Carbon Credits Owned</p>
            <h2 className="stat-value">{balance}</h2>
            <p className="stat-sub">CCT Tokens</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <FaStore />
          </div>
          <div className="stat-info">
            <p className="stat-label">Active Listings</p>
            <h2 className="stat-value">{activeListings}</h2>
            <p className="stat-sub">Available to buy</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FaExchangeAlt />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Listings</p>
            <h2 className="stat-value">{totalListings}</h2>
            <p className="stat-sub">All time</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaWallet />
          </div>
          <div className="stat-info">
            <p className="stat-label">Wallet</p>
            <h2 className="stat-value">Connected</h2>
            <p className="stat-sub">MetaMask</p>
          </div>
        </div>
      </div>

      <div className="info-box">
        <h3>About Carbon Credits</h3>
        <p>1 Carbon Credit (CCT) = Permission to emit 1 ton of CO₂. Companies that emit less carbon can sell their unused credits to companies that exceed their limits.</p>
      </div>
    </div>
  );
};

export default Dashboard;
