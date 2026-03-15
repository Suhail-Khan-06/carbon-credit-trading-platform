import { FaLeaf } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ account, onSwitch }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaLeaf className="brand-icon" />
        <span>CarbonTrade</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        <NavLink to="/marketplace" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Marketplace</NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Transactions</NavLink>
      </div>

      <div className="navbar-wallet">
        <div className="wallet-connected">
          <span className="wallet-dot" />
          <span className="wallet-address">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
        <button
          onClick={onSwitch}
          style={{
            marginLeft: "0.5rem",
            padding: "0.3rem 0.7rem",
            fontSize: "0.7rem",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Switch
        </button>
      </div>
    </nav>
  );
};


export default Navbar;
