import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiMail,
  FiUser,
  FiX,
  FiMenu,
  FiPackage,
} from "react-icons/fi";
import { FaOpencart } from "react-icons/fa";

import { useCart } from "../CartContext";
import logo from "../assets/logo.png";
import { navbarStyles } from "../assets/dummyStyles";
import { navItems } from "../assets/Dummy";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const prevCartCountRef = useRef(cartCount);
  const mobileMenuRef = useRef(null);

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  // Detect route change
  useEffect(() => {
    setActiveTab(location.pathname);
    setIsOpen(false);
  }, [location]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart bounce animation
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 800);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Update login state
  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("authToken")));
    };
    window.addEventListener("authStateChanged", handler);
    return () => window.removeEventListener("authStateChanged", handler);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    window.dispatchEvent(new Event("authStateChanged"));

    navigate("/login");
  };

  // Add My Orders dynamically
  const getNavItems = () => {
    const base = [...navItems];

    if (isLoggedIn) {
      const shopIndex = base.findIndex((i) => i.name === "Shop");
      if (shopIndex !== -1) {
        base.splice(shopIndex + 1, 0, {
          name: "My Orders",
          path: "/myorders",
          icon: <FiPackage />,
        });
      }
    }

    return base;
  };

  const updatedNavItems = getNavItems();

  return (
    <nav
      className={`${navbarStyles.nav} ${
        scrolled ? navbarStyles.scrolledNav : navbarStyles.unscrolledNav
      }`}
    >
      <div className={navbarStyles.borderGradient}></div>

      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <Link to="/" className={navbarStyles.logoLink}>
            <img
              src={logo}
              alt="Logo"
              className={`${navbarStyles.logoImage} ${
                scrolled ? "h-10 w-10" : "h-12 w-12"
              }`}
            />
            <span className={navbarStyles.logoText}>RushBasket</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className={navbarStyles.desktopNav}>
            {updatedNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${navbarStyles.navItem} ${
                  activeTab === item.path
                    ? navbarStyles.activeNavItem
                    : navbarStyles.inactiveNavItem
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`${navbarStyles.navIcon} ${
                      activeTab === item.path
                        ? navbarStyles.activeNavIcon
                        : navbarStyles.inactiveNavIcon
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          <div className={navbarStyles.iconsContainer}>
            {/* Login / Logout */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className={navbarStyles.loginLink}>
                <FiUser className={navbarStyles.loginIcon} /> Logout
              </button>
            ) : (
              <Link to="/login" className={navbarStyles.loginLink}>
                <FiUser className={navbarStyles.loginIcon} /> Login
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className={navbarStyles.cartLink}>
              <FaOpencart
                className={`${navbarStyles.cartIcon} ${
                  cartBounce ? "animate-bounce" : ""
                }`}
              />
              {cartCount > 0 && (
                <span className={navbarStyles.cartBadge}>{cartCount}</span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={navbarStyles.hamburgerButton}
            >
              {isOpen ? (
                <FiX className="text-white" />
              ) : (
                <FiMenu className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${navbarStyles.mobileOverlay} ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          ref={mobileMenuRef}
          className={`${navbarStyles.mobilePanel} ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={navbarStyles.mobileHeader}>
            <img src={logo} className={navbarStyles.mobileLogoImage} />
            <span className={navbarStyles.mobileLogoText}>RushBasket</span>

            <button onClick={() => setIsOpen(false)}>
              <FiX className="text-white" />
            </button>
          </div>

          <div className={navbarStyles.mobileItemsContainer}>
            {updatedNavItems.map((item, idx) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={navbarStyles.mobileItem}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* Mobile Login / Logout */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className={navbarStyles.loginButton}
              >
                <FiUser /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={navbarStyles.loginButton}
                onClick={() => setIsOpen(false)}
              >
                <FiUser /> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{navbarStyles.customCSS}</style>
    </nav>
  );
}
