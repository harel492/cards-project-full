import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Favorites from './pages/Favorites';
import MyCards from './pages/MyCards';
import CreateCard from './pages/CreateCard';
import EditCard from './pages/EditCard';
import Profile from './pages/Profile';
import CRM from './pages/CRM';
import './App.css';

function ProtectedRoute({ children, requireBusiness = false, requireAdmin = false }) {
  const { isAuthenticated, isBusiness, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem'
      }}>
        טוען...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireBusiness && !isBusiness && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: 'var(--color-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>טוען...</div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar onSearch={handleSearch} />

        <main>
          <Routes>            <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-cards"
              element={
                <ProtectedRoute requireBusiness={true}>
                  <MyCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-card"
              element={
                <ProtectedRoute requireBusiness={true}>
                  <CreateCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-card/:id"
              element={
                <ProtectedRoute>
                  <EditCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CRM />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-background-secondary)',
            color: 'var(--color-text)',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;