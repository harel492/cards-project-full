import { useState } from 'react';
import { Heart, Edit, Trash2, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import  api  from '../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CardItem({ card, onDelete, onLike }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cardOwnerId = card.user_id?._id || card.user_id;
  const isOwner = user && (cardOwnerId?.toString() === user?._id?.toString() || isAdmin);
  const isLiked = user && card.likes && card.likes.some(like => like?.toString() === user?._id?.toString());

  const handleLike = async () => {
    if (!user) {
      toast.error('עליך להתחבר כדי לסמן לייק');
      return;
    }

    try {
      setIsLiking(true);
      const response = await api.patch(`/cards/${card._id}`);
      
      if (response.status === 200) {
        toast.success(isLiked ? 'הסרת מהמועדפים' : 'נוסף למועדפים');
        if (onLike) {
          const updatedCard = response.data?.data?.card || response.data?.card || response.data;
          onLike(card._id, updatedCard);
        }
      }
    } catch (error) {
      toast.error('שגיאה בעדכון המועדפים');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      toast.error('אין לך הרשאה למחוק כרטיס זה');
      return;
    }

    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הכרטיס?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/cards/${card._id}`);
      toast.success('הכרטיס נמחק בהצלחה');
      if (onDelete) {
        onDelete(card._id);
      }
    } catch (error) {
      toast.error('שגיאה במחיקת הכרטיס');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-card/${card._id}`);
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 'var(--border-radius)',
      padding: '1rem',
      backgroundColor: 'var(--color-background)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{card.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            disabled={isLiking}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isLiked ? 'var(--color-error)' : 'var(--color-text)',
              opacity: isLiking ? 0.5 : 1
            }}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          
          {isOwner && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary)'
                }}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-error)',
                  opacity: isDeleting ? 0.5 : 1
                }}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <p style={{ margin: '0.5rem 0', color: 'var(--color-text-secondary)' }}>{card.subtitle}</p>
      <p style={{ margin: '0.5rem 0', fontSize: '0.9em' }}>{card.description}</p>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {card.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9em' }}>
            <Phone size={14} />
            <a href={`tel:${card.phone}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
              {card.phone}
            </a>
          </div>
        )}
        
        {card.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9em' }}>
            <Mail size={14} />
            <a href={`mailto:${card.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
              {card.email}
            </a>
          </div>
        )}
        
        {card.web && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9em' }}>
            <Globe size={14} />
            <a href={card.web} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
              {card.web}
            </a>
          </div>
        )}
        
        {card.address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9em' }}>
            <MapPin size={14} />
            <span>
              {card.address.street} {card.address.houseNumber}, {card.address.city}
            </span>
          </div>
        )}
      </div>

      {card.image && card.image.url && (
        <img 
          src={card.image.url} 
          alt={card.image.alt || 'Business card image'} 
          style={{
            width: '100%',
            height: 150,
            objectFit: 'cover',
            borderRadius: 'var(--border-radius)',
            marginTop: '1rem'
          }}
        />
      )}
    </div>
  );
} 