import "./Navbar.css";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <MessageSquare size={20} />
            </div>
            <h1>Chatty</h1>
          </Link>
        </div>
        <div className="navbar-right">
          {/* Settings, Profile, Logout moved to Sidebar bottom */}
        </div>
      </div>
    </header>
  );
};
export default Navbar;




