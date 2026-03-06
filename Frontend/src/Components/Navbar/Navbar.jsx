import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Ensure jwt-decode is installed
import "./Navbar.css";
import logo from "../logo.png"; // Ensure path is correct

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // --- useEffect Hook with Token Expiration Check ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    let isTokenCurrentlyValid = false;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          isTokenCurrentlyValid = true;
          setUserRole(localStorage.getItem("userRole"));
          setUserName(localStorage.getItem("userName"));
          setUserEmail(localStorage.getItem("userEmail"));
        } else {
          console.log("Token expired. Clearing localStorage.");
          localStorage.clear();
        }
      } catch (error) {
        console.error("Invalid token found:", error);
        localStorage.clear();
      }
    }

    setIsLoggedIn(isTokenCurrentlyValid);

    if (!isTokenCurrentlyValid) {
      setUserRole(null);
      setUserName(null);
      setUserEmail(null);
    }
  }, [location]);
  // --- End of useEffect ---

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    setUserEmail(null);
    handleLinkClick();
    navigate("/");
  };

  const renderNavLinks = (isMobile = false) => {
    const clickHandler = () => {
      if (isMobile) handleLinkClick();
      setIsProfileOpen(false);
    };
    const profileLinkClick = () => {
      if (isMobile) handleLinkClick();
      setIsProfileOpen(false);
    };

    if (isLoggedIn) {
      // --- Logged In View ---
      return (
        <>
          {/* --- Home Link (Visible to ALL logged-in users) --- */}
          <Link to="/home" className="nav-link" onClick={clickHandler}>
            Home
          </Link>

          {/* --- Role-Specific Links --- */}
          {userRole === "client" ? (
            // --- CLIENT SPECIFIC LINKS ---
            <>
              <Link
                to="/client-dashboard"
                className="nav-link"
                onClick={clickHandler}
              >
                Dashboard
              </Link>
              <Link
                to="/allocate-project"
                className="nav-link"
                onClick={clickHandler}
              >
                Allocate Project
              </Link>
              {/* --- NEWLY ADDED LINK FOR CLIENTS --- */}
              <Link
                to="/ai-recommendation"
                className="nav-link"
                onClick={clickHandler}
              >
                Ai Recommendation
              </Link>
            </>
          ) : (
            // --- FREELANCER/STUDENT SPECIFIC LINKS ---
            <>
              <Link to="/features" className="nav-link" onClick={clickHandler}>
                Features
              </Link>
              <Link to="/dashboard" className="nav-link" onClick={clickHandler}>
                Dashboard
              </Link>
            </>
          )}

          {/* --- Common Profile Dropdown --- */}
          <div className="profile-menu-container">
            <button
              className="nav-link nav-icon"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Toggle profile menu"
            >
              <FaUserCircle />
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <strong>{userName || "User"}</strong>
                  <span>{userEmail || ""}</span>
                  <span className="role-badge">{userRole || "Role"}</span>
                </div>
                {/* <Link
                  to={userRole === 'client' ? "/cprofile" : "/fprofile"} // Using /cprofile for client
                  className="dropdown-link"
                  onClick={profileLinkClick}
                >
                  Show Full Profile
                </Link> */}
                <Link
                  to={
                    userRole === "client"
                      ? "/cprofile"
                      : userRole === "student"
                        ? "/sprofile"
                        : "/fprofile"
                  }
                  className="dropdown-link"
                  onClick={profileLinkClick}
                >
                  Show Full Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-link-button">
                  Signout
                </button>
              </div>
            )}
          </div>
        </>
      );
    } else {
      // --- Logged Out View ---
      return (
        <>
          <Link to="/" className="nav-link" onClick={clickHandler}>
            Home
          </Link>
          <Link to="/features" className="nav-link" onClick={clickHandler}>
            Features
          </Link>
          <Link to="/" className="nav-link" onClick={clickHandler}>
            About
          </Link>
          <Link to="/" className="nav-link" onClick={clickHandler}>
            Contact
          </Link>
          <Link to="/login" className="nav-link-button" onClick={clickHandler}>
            Login or Signup
          </Link>
         
        </>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          <img
            src={logo}
            alt="CLP Logo"
            className="clp-logo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/100x40/eee/31343C?text=Logo";
            }}
          />
          <span style={{ color: "black" }}>CareerLaunchPad</span>
        </Link>
        <button
          className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className="desktop-nav-links">{renderNavLinks(false)}</div>
        <div className={`mobile-nav-links ${isMenuOpen ? "open" : ""}`}>
          {renderNavLinks(true)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
