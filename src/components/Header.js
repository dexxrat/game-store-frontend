import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setShowMobileMenu(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-btn')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Открыть меню"
            >
              <span className="material-icons">menu</span>
            </button>
            <Link to="/" className="logo">
              ZenStore
            </Link>
          </div>

          <div className={`header-search ${showMobileSearch ? 'mobile-visible' : ''}`}>
            <form onSubmit={handleSearch} className="search-bar">
              <input
                type="text"
                placeholder="Поиск игр..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-submit-btn" aria-label="Искать">
                <span className="material-icons">search</span>
              </button>
            </form>
            {showMobileSearch && (
              <button
                className="mobile-search-close"
                onClick={() => setShowMobileSearch(false)}
                aria-label="Закрыть поиск"
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>

          <div className="header-right">
            <div className="desktop-icons">
              {isAuthenticated() ? (
                <div className="user-dropdown" ref={dropdownRef}>
                  <button className="icon-btn user-icon-btn" onClick={toggleDropdown} title="Аккаунт">
                    <span className="material-icons">account_circle</span>
                  </button>

                  {showDropdown && (
                    <div className="dropdown-content">
                      <div className="dropdown-header">
                        <strong>{user?.username}</strong>
                        <small>{user?.email}</small>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/orders" onClick={() => setShowDropdown(false)} className="dropdown-item">
                        <span className="material-icons">receipt</span>
                        Мои заказы
                      </Link>
                      {isAdmin() && (
                        <Link to="/admin" onClick={() => setShowDropdown(false)} className="dropdown-item">
                          <span className="material-icons">admin_panel_settings</span>
                          Панель администратора
                        </Link>
                      )}
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        <span className="material-icons">logout</span>
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="icon-btn" title="Войти">
                  <span className="material-icons">account_circle</span>
                </Link>
              )}

              <Link to="/cart" className="icon-btn cart-icon" title="Корзина">
                <span className="material-icons">shopping_cart</span>
                {getTotalItems() > 0 && (
                  <span className="cart-count">{getTotalItems()}</span>
                )}
              </Link>
            </div>

            <div className="mobile-icons">
              <button
                className="icon-btn mobile-search-btn"
                onClick={toggleMobileSearch}
                title="Поиск"
              >
                <span className="material-icons">search</span>
              </button>

              {isAuthenticated() ? (
                <button className="icon-btn" onClick={toggleDropdown} title="Аккаунт">
                  <span className="material-icons">account_circle</span>
                </button>
              ) : (
                <Link to="/login" className="icon-btn" title="Войти">
                  <span className="material-icons">account_circle</span>
                </Link>
              )}

              <Link to="/cart" className="icon-btn cart-icon" title="Корзина">
                <span className="material-icons">shopping_cart</span>
                {getTotalItems() > 0 && (
                  <span className="cart-count">{getTotalItems()}</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <nav className={`header-nav ${showMobileMenu ? 'mobile-visible' : ''}`} ref={mobileMenuRef}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>
            Главная
          </Link>
          <Link to="/games" className={`nav-link ${isActive('/games') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>
            Каталог
          </Link>
          {isAuthenticated() && (
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>
              История заказов
            </Link>
          )}
          {isAuthenticated() && isAdmin() && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>
              Панель администратора
            </Link>
          )}
          {isAuthenticated() && (
            <button onClick={handleLogout} className="nav-link logout-mobile">
              <span className="material-icons">logout</span>
              Выйти
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;