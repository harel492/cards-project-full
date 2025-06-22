import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import  api  from '../api/axios';
import { Users, Search, Edit, Trash2, Loader, UserCheck, UserX } from 'lucide-react';

export default function CRM() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter(user => 
      user.name?.first?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.last?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      const usersData = response.data?.data?.users || response.data?.users || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      setError('שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBusinessStatus = async (userId, currentStatus) => {
    try {
      const response = await api.patch(`/users/${userId}`, {
        isBusiness: !currentStatus
      });
      
      if (response.status === 200) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, isBusiness: !currentStatus }
              : user
          )
        );
        toast.success(`סטטוס המשתמש שונה ל-${!currentStatus ? 'עסקי' : 'רגיל'}`);
      }
    } catch (error) {
      toast.error('שגיאה בשינוי סטטוס המשתמש');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      toast.success('המשתמש נמחק בהצלחה');
    } catch (error) {
      toast.error('שגיאה במחיקת המשתמש');
    }
  };

  const getFullName = (name) => {
    if (!name) return 'לא ידוע';
    return [name.first, name.middle, name.last].filter(Boolean).join(' ');
  };

  const getRoleText = (user) => {
    if (user.isAdmin) return 'מנהל';
    if (user.isBusiness) return 'עסקי';
    return 'רגיל';
  };

  const getRoleColor = (user) => {
    if (user.isAdmin) return 'var(--color-error)';
    if (user.isBusiness) return 'var(--color-primary)';
    return 'var(--color-text-secondary)';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Users size={24} />
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>ניהול משתמשים (CRM)</h1>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: 400 }}>
          <Search size={20} />
          <input
            type="text"
            placeholder="חיפוש משתמשים..."
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
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          padding: '1rem', 
          border: '1px solid #ddd', 
          borderRadius: 'var(--border-radius)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>
            {Array.isArray(users) ? users.length : 0}
          </h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>סה"כ משתמשים</p>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          border: '1px solid #ddd', 
          borderRadius: 'var(--border-radius)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>
            {Array.isArray(users) ? users.filter(u => u.isBusiness).length : 0}
          </h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>משתמשים עסקיים</p>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          border: '1px solid #ddd', 
          borderRadius: 'var(--border-radius)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-error)' }}>
            {Array.isArray(users) ? users.filter(u => u.isAdmin).length : 0}
          </h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>מנהלים</p>
        </div>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: 'var(--border-radius)', 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', 
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--color-background-secondary)',
          fontWeight: 'bold',
          borderBottom: '1px solid #ddd'
        }}>
          <div>שם</div>
          <div>אימייל</div>
          <div>טלפון</div>
          <div>תפקיד</div>
          <div>תאריך הצטרפות</div>
          <div>פעולות</div>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            {searchTerm ? 'לא נמצאו משתמשים התואמים לחיפוש' : 'אין משתמשים'}
          </div>
        ) : (
          filteredUsers.map(userItem => (
            <div 
              key={userItem._id}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', 
                gap: '1rem',
                padding: '1rem',
                borderBottom: '1px solid #eee',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {getFullName(userItem.name)}
                </div>
                {userItem._id === user._id && (
                  <span style={{ 
                    fontSize: '0.8em', 
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-primary-light)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--border-radius)'
                  }}>
                    אתה
                  </span>
                )}
              </div>
              
              <div style={{ fontSize: '0.9em' }}>
                {userItem.email}
              </div>
              
              <div style={{ fontSize: '0.9em' }}>
                {userItem.phone || 'לא צוין'}
              </div>
              
              <div>
                <span style={{ 
                  color: getRoleColor(userItem),
                  fontWeight: 'bold',
                  fontSize: '0.9em'
                }}>
                  {getRoleText(userItem)}
                </span>
              </div>
              
              <div style={{ fontSize: '0.9em' }}>
                {new Date(userItem.createdAt).toLocaleDateString('he-IL')}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {/* Toggle Business Status */}
                {!userItem.isAdmin && (
                  <button
                    onClick={() => handleToggleBusinessStatus(userItem._id, userItem.isBusiness)}
                    disabled={updatingUser === userItem._id}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: userItem.isBusiness ? 'var(--color-error)' : 'var(--color-primary)',
                      opacity: updatingUser === userItem._id ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.8em'
                    }}
                  >
                    {updatingUser === userItem._id ? (
                      <Loader size={12} className="spinner" />
                    ) : userItem.isBusiness ? (
                      <>
                        <UserX size={12} />
                        בטל עסקי
                      </>
                    ) : (
                      <>
                        <UserCheck size={12} />
                        הפעל עסקי
                      </>
                    )}
                  </button>
                )}
                
                {/* Delete User */}
                {!userItem.isAdmin && userItem._id !== user._id && (
                  <button
                    onClick={() => handleDeleteUser(userItem._id)}
                    disabled={deletingUser === userItem._id}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-error)',
                      opacity: deletingUser === userItem._id ? 0.5 : 1
                    }}
                  >
                    {deletingUser === userItem._id ? (
                      <Loader size={12} className="spinner" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        border: '1px solid #ddd', 
        borderRadius: 'var(--border-radius)',
        backgroundColor: 'var(--color-background-secondary)'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)' }}>הסברים:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>מנהל</span>
            <span>- לא ניתן למחוק או לשנות סטטוס</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>עסקי</span>
            <span>- משתמש עם הרשאות עסקיות</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>רגיל</span>
            <span>- משתמש רגיל ללא הרשאות עסקיות</span>
          </div>
        </div>
      </div>
    </div>
  );
} 