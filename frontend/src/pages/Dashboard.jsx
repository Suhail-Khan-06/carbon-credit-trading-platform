const Dashboard = ({ signer, account }) => {
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>Dashboard</h1>
      <p>Account: {account || "Not connected"}</p>
    </div>
  );
};

export default Dashboard;
