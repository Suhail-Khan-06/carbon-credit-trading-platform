import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MarketplacePage from "./pages/MarketplacePage";
import Transactions from "./pages/Transactions";
import { connectWallet } from "./blockchain/connectWallet";
import "./index.css";

function App() {
  const [web3State, setWeb3State] = useState({
    provider: null,
    signer: null,
    account: null,
  });

  const handleConnect = async () => {
    try {
      const { provider, signer, account } = await connectWallet();
      setWeb3State({ provider, signer, account });
    } catch (e) {
      console.error(e);
      alert("Failed to connect wallet: " + e.message);
    }
  };

  return (
    <Router>
      <Navbar account={web3State.account} onConnect={handleConnect} />
      <Routes>
        <Route path="/" element={<Dashboard signer={web3State.signer} account={web3State.account} />} />
        <Route path="/marketplace" element={<MarketplacePage signer={web3State.signer} account={web3State.account} />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;
