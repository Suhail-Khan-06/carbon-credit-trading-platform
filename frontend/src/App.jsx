import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MarketplacePage from "./pages/MarketplacePage";
import Transactions from "./pages/Transactions";
import { account, buyerAccount } from "./blockchain/connectWallet";
import "./index.css";

function App() {
  const [activeAccount, setActiveAccount] = useState(account); // default Account #0

  return (
    <Router>
      <Navbar
        account={activeAccount}
        onSwitch={() =>
          setActiveAccount((prev) =>
            prev === account ? buyerAccount : account
          )
        }
      />
      <Routes>
        <Route path="/" element={<Dashboard account={activeAccount} />} />
        <Route path="/marketplace" element={<MarketplacePage activeAccount={activeAccount} />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;
