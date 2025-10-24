import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-link">
          LUMINA
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/detail" className="nav-link">
            작업물
          </Link>
        </li>
        <li>
          <Link to="/login" className="nav-link">
            로그인
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
