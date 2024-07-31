import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const Header: React.FC = () => {
  const { state } = useContext(UserContext);
  const username = state.username || "Guest";
  const balance = state.balance || "";

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
      <div className="fw-bold">App</div>
      {username !== "Guest" && (
        <nav>
          <Link to="/new-operation" className="me-3">
            New Operation
          </Link>
          <Link to="/records">Records</Link>
        </nav>
      )}
      <div className="fst-italic">
        {username}{balance !== "" ? ", balance:" : ""} {balance}
      </div>
    </header>
  );
};

export default Header;
