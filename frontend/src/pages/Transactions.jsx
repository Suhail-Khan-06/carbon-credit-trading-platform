import { FaExchangeAlt, FaLeaf, FaStore } from "react-icons/fa";
import "./Transactions.css";

const Transactions = () => {
  const steps = [
    { icon: <FaLeaf />, color: "green", title: "Admin Mints Credits", desc: "Authority issues carbon credits to a company wallet on-chain." },
    { icon: <FaStore />, color: "blue", title: "Company Lists Credits", desc: "Company approves marketplace and lists credits for sale at a set ETH price." },
    { icon: <FaExchangeAlt />, color: "purple", title: "Company Buys Credits", desc: "Buyer sends exact ETH, credits transfer atomically on blockchain." },
  ];

  return (
    <div className="transactions">
      <div className="transactions-header">
        <h1>Transaction History</h1>
        <p>All trades are permanently recorded on the Ethereum blockchain</p>
      </div>

      <div className="tx-info-card">
        <h2>How Transactions Work</h2>
        <div className="steps">
          {steps.map((s, i) => (
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

      <div className="tx-blockchain-card">
        <h2>Where to View Transactions</h2>
        <div className="tx-options">
          <div className="tx-option">
            <h3>Remix IDE</h3>
            <p>Check the terminal logs in Remix to see every transaction hash, event, and gas cost in real time.</p>
          </div>
          <div className="tx-option">
            <h3>Etherscan (Testnet)</h3>
            <p>If deployed to Sepolia testnet, search your contract address on sepolia.etherscan.io to see all transactions.</p>
          </div>
          <div className="tx-option">
            <h3>MetaMask Activity</h3>
            <p>Open MetaMask → Activity tab to see all wallet transactions including approvals, listings and purchases.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
