import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import CardItem from '../components/CardItem';
import { Loader, Search, Filter } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (!Array.isArray(cards)) {
      setFilteredCards([]);
      return;
    }

    const filtered = cards.filter(card => 
      card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCards(filtered);
  }, [cards, searchTerm]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cards');
      
      const cardsData = response.data?.data?.cards || response.data?.cards || response.data || [];
      setCards(Array.isArray(cardsData) ? cardsData : []);
    } catch (error) {
      setLoading(false);
      setError('שגיאה בטעינת הכרטיסים');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (cardId, updatedCard) => {
    setCards(prevCards => {
      if (!Array.isArray(prevCards)) return [];
      return prevCards.map(card => 
        card._id === cardId ? updatedCard : card
      );
    });
  };

  const handleDelete = (cardId) => {
    setCards(prevCards => {
      if (!Array.isArray(prevCards)) return [];
      return prevCards.filter(card => card._id !== cardId);
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size={32} className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>כרטיסי ביקור</h1>
      
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1rem',
          maxWidth: 500 
        }}>
          <Search size={20} />
          <input
            type="text"
            placeholder="חיפוש בכרטיסי ביקור..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem',
          fontSize: '0.9em',
          color: 'var(--color-text-secondary)'
        }}>
          <span>סה"כ כרטיסים: {Array.isArray(cards) ? cards.length : 0}</span>
          {searchTerm && <span>תוצאות חיפוש: {filteredCards.length}</span>}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: 'var(--color-text-secondary)'
        }}>
          {searchTerm ? (
            <>
              <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>לא נמצאו כרטיסים התואמים לחיפוש</h3>
              <p>נסה לשנות את מילות החיפוש</p>
            </>
          ) : (
            <>
              <Filter size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>אין כרטיסי ביקור זמינים</h3>
              <p>היה הראשון ליצור כרטיס ביקור!</p>
            </>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredCards.map(card => (
            <CardItem 
              key={card._id} 
              card={card} 
              onLike={handleLike}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 