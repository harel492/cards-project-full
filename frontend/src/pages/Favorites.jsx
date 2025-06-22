import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CardItem from '../components/CardItem';
import toast from 'react-hot-toast';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/cards');
      
      const allCards = response.data?.data?.cards || response.data?.cards || response.data || [];
      const userFavorites = Array.isArray(allCards) ? allCards.filter(card => 
        card.likes?.includes(user?._id)
      ) : [];
      setFavorites(userFavorites);
    } catch (err) {
      setLoading(false);
      setError('שגיאה בטעינת המועדפים');
    } finally {
      setLoading(false);
    }
  };

  const handleCardUpdate = (updatedCard) => {
    setFavorites(prevCards => 
      prevCards.map(card => 
        card._id === updatedCard._id ? updatedCard : card
      )
    );
  };

  const handleCardDelete = (cardId) => {
    setFavorites(prevCards => prevCards.filter(card => card._id !== cardId));
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>מועדפים</h1>
          <p>עליך להתחבר כדי לצפות במועדפים שלך</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.2em', marginBottom: '1rem' }}>טוען מועדפים...</div>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{error}</div>
          <button onClick={fetchFavorites}>נסה שוב</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>המועדפים שלי</h1>
      
      {favorites.length > 0 ? (
        <>
          <p style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
            {favorites.length} כרטיסים במועדפים
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {favorites.map(card => (
              <CardItem 
                key={card._id} 
                card={card}
                onUpdate={handleCardUpdate}
                onDelete={handleCardDelete}
              />
            ))}
          </div>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: 'var(--color-secondary)'
        }}>
          <div style={{ fontSize: '1.5em', marginBottom: '1rem' }}>אין מועדפים</div>
          <p>עדיין לא סימנת כרטיסים כמועדפים</p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/">
              <button>עבור לדף הבית</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 