import React, { useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../config/constants';
import genres from '../../config/genres';
import './Navbar.css';

/**
 * Navbar component - Main navigation with authentication and genre dropdown
 */
const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handle scroll event to change navbar background
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Handle search submission
   */
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/movies/search', { state: { query: searchQuery } });
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  /**
   * Handle genre selection
   */
  const handleGenreClick = useCallback((genreId) => {
    navigate(`/movies/${genreId}`);
    setIsDropdownOpen(false);
  }, [navigate]);

  /**
   * Handle logout
   */
  const handleLogout = useCallback(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);

  /**
   * Toggle dropdown visibility
   */
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  /**
   * Close dropdown on outside click
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <nav
      style={{
        background: isScrolled ? COLORS.PRIMARY : 'rgba(0, 0, 0, 0.7)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'background 0.3s ease',
        borderBottom: isScrolled ? `1px solid ${COLORS.SECONDARY}` : 'none',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: COLORS.SECONDARY,
        }}
      >
        EntBuds
      </div>

      {/* Center Navigation */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {/* Genres Dropdown */}
        <div className="dropdown" style={{ position: 'relative' }}>
          <button
            onClick={toggleDropdown}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.TEXT,
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.SECONDARY)}
            onMouseLeave={(e) => (e.target.style.color = COLORS.TEXT)}
          >
            Genres ▼
          </button>

              {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: COLORS.PRIMARY,
                border: `1px solid ${COLORS.SECONDARY}`,
                borderRadius: '4px',
                marginTop: '0.5rem',
                minWidth: '150px',
                zIndex: 1001,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              }}
            >
              {Object.entries(genres).map(([key, genre]) => (
                <button
                  key={key}
                  onClick={() => handleGenreClick(key)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: COLORS.TEXT,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = COLORS.SECONDARY)}
                  onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                >
                  {genre.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: `1px solid ${COLORS.SECONDARY}`,
              background: COLORS.DARK_BG,
              color: COLORS.TEXT,
              fontSize: '0.95rem',
              width: '200px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              background: COLORS.SECONDARY,
              color: COLORS.PRIMARY,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Search
          </button>
        </form>

        {/* Booking Link */}
        <button
          onClick={() => navigate('/booking')}
          style={{
            background: 'transparent',
            border: 'none',
            color: COLORS.TEXT,
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.color = COLORS.SECONDARY)}
          onMouseLeave={(e) => (e.target.style.color = COLORS.TEXT)}
        >
          Book Tickets
        </button>

        {/* My List Link */}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/userList')}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.TEXT,
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.SECONDARY)}
            onMouseLeave={(e) => (e.target.style.color = COLORS.TEXT)}
          >
            My List
          </button>
        )}
      </div>

      {/* Right Auth Section */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: COLORS.TEXT, fontSize: '0.9rem' }}>
              Welcome, {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: COLORS.ERROR,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            style={{
              padding: '0.5rem 1rem',
              background: COLORS.SECONDARY,
              color: COLORS.PRIMARY,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
