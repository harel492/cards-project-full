import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Home, Info, Heart, User, Plus, Settings, Users, LogOut, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

// Theme toggle component
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

export default function Navbar({ onSearch }) {
  const { user, isAuthenticated, isBusiness, isAdmin, logout, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ 
      padding: '1rem', 
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>BCard</h1>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400, margin: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
          <input
            type="text"
            placeholder="חיפוש בכרטיסי ביקור..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              border: 'none', 
              padding: '0.5em', 
              flex: 1,
              margin: 0
            }}
          />
          <button 
            type="submit" 
            style={{ 
              border: 'none', 
              background: 'var(--color-primary)', 
              color: 'white', 
              padding: '0.5em',
              cursor: 'pointer'
            }}
          >
            <Search size={16} />
          </button>
        </div>
      </form>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
          <Home size={16} />
          בית
        </Link>
        
        <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
          <Info size={16} />
          אודות
        </Link>

        {/* Show loading state while maintaining navbar structure */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-secondary)' }}>
            <Loader size={16} className="spinner" />
            <span style={{ fontSize: '0.9em' }}>טוען...</span>
          </div>
        ) : (
          <>
            {/* Authenticated user menu */}
            {isAuthenticated && (
              <>
                <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
                  <Heart size={16} />
                  מועדפים
                </Link>

                {(isBusiness || isAdmin) && (
                  <>
                    <Link to="/my-cards" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
                      <User size={16} />
                      הכרטיסים שלי
                    </Link>
                    
                    <Link to="/create-card" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
                      <Plus size={16} />
                      יצירת כרטיס
                    </Link>
                  </>
                )}

                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
                  <Settings size={16} />
                  פרופיל
                </Link>

                {isAdmin && (
                  <Link to="/crm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
                    <Users size={16} />
                    CRM
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  <LogOut size={16} />
                  התנתק
                </button>
              </>
            )}

            {/* Non-authenticated user menu */}
            {!isAuthenticated && (
              <>
                <Link to="/login">
                  <button style={{ fontSize: '0.9em', padding: '0.4em 0.8em' }}>
                    התחברות
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{ fontSize: '0.9em', padding: '0.4em 0.8em' }}>
                    הרשמה
                  </button>
                </Link>
              </>
            )}
          </>
        )}

        <ThemeToggle />
      </nav>
    </header>
  );
}