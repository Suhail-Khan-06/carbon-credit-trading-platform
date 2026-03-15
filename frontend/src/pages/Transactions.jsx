import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts, account, buyerAccount } from "../blockchain/connectWallet";
import { FaExchangeAlt, FaLeaf, FaStore, FaSpinner } from "react-icons/fa";
import "./Transactions.css";

const Transactions = () => {
  const [txHistory, setTxHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { marketplace } = await getContracts();

      // Fetch all three event types
      const listFilter = marketplace.filters.ListingCreated();
      const buyFilter = marketplace.filters.CreditsPurchased();
      const cancelFilter = marketplace.filters.ListingCancelled();

      const [listEvents, buyEvents, cancelEvents] = await Promise.all([
        marketplace.queryFilter(listFilter),
        marketplace.queryFilter(buyFilter),
        marketplace.queryFilter(cancelFilter),
      ]);

      // Format events into unified history
      const history = [
        ...listEvents.map((e) => ({
          type: "Listed",
          icon: "list",
          address: e.args[1], // seller
          amount: Number(e.args[2]),
          price: ethers.formatEther(e.args[3]),
          txHash: e.transactionHash,
          block: e.blockNumber,
        })),
        ...buyEvents.map((e) => ({
          type: "Purchased",
          icon: "buy",
          address: e.args[1], // buyer
          amount: Number(e.args[2]),
          price: ethers.formatEther(e.args[3]),
          txHash: e.transactionHash,
          block: e.blockNumber,
        })),
        ...cancelEvents.map((e) => ({
          type: "Cancelled",
          icon: "cancel",
          address: e.args[1], // seller
          amount: null,
          price: null,
          txHash: e.transactionHash,
          block: e.blockNumber,
        })),
      ].sort((a, b) => b.block - a.block); // newest first

      setTxHistory(history);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getLabel = (addr) => {
    if (addr?.toLowerCase() === account.toLowerCase()) return "Account #0";
    if (addr?.toLowerCase() === buyerAccount.toLowerCase()) return "Account #1";
    return addr?.slice(0, 6) + "..." + addr?.slice(-4);
  };

  const iconMap = {
    list: <FaStore />,
    buy: <FaExchangeAlt />,
    cancel: <FaLeaf />,
  };

  const colorMap = {
    list: "blue",
    buy: "green",
    cancel: "orange",
  };

  return (
    <div className="transactions">
      <div className="transactions-header">
        <h1>Transaction History</h1>
        <p>All trades permanently recorded on the local blockchain</p>
      </div>

      <div className="tx-live-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2>Live Activity</h2>
          <button className="refresh-btn" onClick={loadHistory} disabled={loading}>
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="empty-state"><p>Loading transactions...</p></div>
        ) : txHistory.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet</p>
            <span>List or buy credits to see activity here</span>
          </div>
        ) : (
          <div className="listings-list">
            {txHistory.map((tx, i) => (
              <div key={i} className="listing-item">
                <div className="listing-info">
                  <div className={`step-icon ${colorMap[tx.icon]}`} style={{ marginRight: "1rem" }}>
                    {iconMap[tx.icon]}
                  </div>
                  <div>
                    <div className="listing-amount" style={{ fontSize: "0.95rem" }}>
                      {tx.type}
                      {tx.amount && <span style={{ marginLeft: "0.5rem" }}>{tx.amount} CCT</span>}
                    </div>
                    <div className="listing-seller">{getLabel(tx.address)}</div>
                  </div>
                </div>
                <div className="listing-right">
                  {tx.price && <div className="listing-price">{tx.price} ETH</div>}
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                    Block #{tx.block}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                    {tx.txHash.slice(0, 10)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tx-info-card">
        <h2>How Transactions Work</h2>
        <div className="steps">
          {[
            { icon: <FaLeaf />, color: "green", title: "Admin Mints Credits", desc: "Authority issues carbon credits to a company wallet on-chain." },
            { icon: <FaStore />, color: "blue", title: "Company Lists Credits", desc: "Company approves marketplace and lists credits for sale at a set ETH price." },
            { icon: <FaExchangeAlt />, color: "purple", title: "Buyer Purchases Credits", desc: "Buyer sends exact ETH, credits transfer atomically on blockchain." },
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className={`step-icon ${s.color}`}>{s.icon}</div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
