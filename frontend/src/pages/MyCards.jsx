import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CardItem from '../components/CardItem';
import toast from 'react-hot-toast';

export default function MyCards() {
  const { user, isBusiness, isAdmin } = useAuth();
  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/cards');
      
      const cardsData = response.data?.data?.cards || response.data?.cards || response.data || [];
      const myCards = Array.isArray(cardsData) ? cardsData.filter(card => 
        card.user_id?._id === user?._id || card.user_id === user?._id
      ) : [];
      setMyCards(myCards);
    } catch (err) {
      setLoading(false);
      setError('שגיאה בטעינת הכרטיסים שלי');
    } finally {
      setLoading(false);
    }
  };

  const handleCardUpdate = (updatedCard) => {
    setMyCards(prevCards => 
      prevCards.map(card => 
        card._id === updatedCard._id ? updatedCard : card
      )
    );
  };

  const handleCardDelete = (cardId) => {
    setMyCards(prevCards => prevCards.filter(card => card._id !== cardId));
  };

  useEffect(() => {
    if (user && (isBusiness || isAdmin)) {
      fetchMyCards();
    }
  }, [user, isBusiness, isAdmin]);

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>הכרטיסים שלי</h1>
          <p>עליך להתחבר כדי לצפות בכרטיסים שלך</p>
        </div>
      </div>
    );
  }

  if (!isBusiness && !isAdmin) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>הכרטיסים שלי</h1>
          <p>עליך להיות משתמש עסקי כדי ליצור כרטיסי ביקור</p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/">
              <button>עבור לדף הבית</button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.2em', marginBottom: '1rem' }}>טוען הכרטיסים שלך...</div>
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
          <button onClick={fetchMyCards}>נסה שוב</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>הכרטיסים שלי</h1>
        <a href="/create-card">
          <button>צור כרטיס חדש</button>
        </a>
      </div>
      
      {myCards.length > 0 ? (
        <>
          <p style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
            {myCards.length} כרטיסים שלך
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {myCards.map(card => (
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
          <div style={{ fontSize: '1.5em', marginBottom: '1rem' }}>אין כרטיסים</div>
          <p>עדיין לא יצרת כרטיסי ביקור</p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/create-card">
              <button>צור כרטיס ביקור ראשון</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 