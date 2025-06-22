import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Save, Loader, Eye, EyeOff } from 'lucide-react';

const schema = yup.object({
  name: yup.object({
    first: yup.string().optional(),
    middle: yup.string().optional(),
    last: yup.string().optional()
  }),
  phone: yup.string().optional(),
  email: yup.string().optional(),
  'image.url': yup.string().optional(),
  'image.alt': yup.string().optional(),
  'address.country': yup.string().optional(),
  'address.city': yup.string().optional(),
  'address.street': yup.string().optional(),
  'address.houseNumber': yup.number().optional(),
  'address.zip': yup.string().optional(),
  'address.state': yup.string().optional()
});

export default function Profile() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cardsCount, setCardsCount] = useState(0);
  const hasInitialized = useRef(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit'
  });

  const getUserData = () => {
    return user?.user || user;
  };

  const getUserId = () => {
    const userData = getUserData();
    return userData?._id;
  };

  useEffect(() => {
    if (user && !hasInitialized.current) {
      const userData = getUserData();
      if (userData && userData.name && userData.address) {
        const formData = {
          'name.first': userData.name.first || '',
          'name.middle': userData.name.middle || '',
          'name.last': userData.name.last || '',
          'phone': userData.phone || '',
          'email': userData.email || '',
          'image.url': userData.image?.url || '',
          'image.alt': userData.image?.alt || '',
          'address.country': userData.address.country || '',
          'address.city': userData.address.city || '',
          'address.street': userData.address.street || '',
          'address.houseNumber': userData.address.houseNumber || '',
          'address.zip': userData.address.zip || '',
          'address.state': userData.address.state || ''
        };
        
        reset(formData, { 
          keepDirty: false, 
          keepTouched: false, 
          keepErrors: false,
          keepValues: false 
        });
        hasInitialized.current = true;
      }
    }
  }, [user, reset]);

  useEffect(() => {
    const loadCardsCount = async () => {
      const userId = getUserId();
      
      if (userId) {
        try {
          const response = await api.get(`/cards/user/${userId}`);
          if (response.data && Array.isArray(response.data)) {
            setCardsCount(response.data.length);
          }
        } catch (error) {
          console.log('[Profile] loadCardsCount error:', error);
          setCardsCount(0);
        }
      }
    };

    loadCardsCount();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'לא זמין';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'לא זמין';
      return date.toLocaleDateString('he-IL');
    } catch (error) {
      return 'לא זמין';
    }
  };

  const getUserRole = () => {
    const userData = getUserData();
    if (userData?.isAdmin) return 'מנהל';
    if (userData?.isBusiness) return 'עסקי';
    return 'רגיל';
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const userId = getUserId();
      
      if (!userId) {
        toast.error('שגיאה: לא ניתן לזהות את המשתמש. אנא התחבר מחדש.');
        return;
      }
      
      const updateData = {
        name: {},
        image: {},
        address: {}
      };

      // Handle name fields
      if (data['name.first']) updateData.name.first = data['name.first'];
      if (data['name.middle']) updateData.name.middle = data['name.middle'];
      if (data['name.last']) updateData.name.last = data['name.last'];

      // Handle contact fields
      if (data.phone) updateData.phone = data.phone;
      if (data.email) updateData.email = data.email;

      // Handle image fields
      if (data['image.url']) updateData.image.url = data['image.url'];
      if (data['image.alt']) updateData.image.alt = data['image.alt'];

      // Handle address fields
      if (data['address.country']) updateData.address.country = data['address.country'];
      if (data['address.city']) updateData.address.city = data['address.city'];
      if (data['address.street']) updateData.address.street = data['address.street'];
      if (data['address.houseNumber']) updateData.address.houseNumber = parseInt(data['address.houseNumber']);
      if (data['address.zip']) updateData.address.zip = data['address.zip'];
      if (data['address.state']) updateData.address.state = data['address.state'];

      // Remove empty objects
      if (Object.keys(updateData.name).length === 0) delete updateData.name;
      if (Object.keys(updateData.image).length === 0) delete updateData.image;
      if (Object.keys(updateData.address).length === 0) delete updateData.address
      
      const response = await api.put(`/users/${userId}`, updateData);

      let updatedUser = null;
      
      if (response.data?.data?.user) {
        updatedUser = response.data.data.user;
      } else if (response.data?.user) {
        updatedUser = response.data.user;
      } else if (response.data?.data) {
        updatedUser = response.data.data;
      } else if (response.data) {
        updatedUser = response.data;
      }
            
      if (updatedUser && updatedUser._id) {
        updateUser(updatedUser);
        
        const formData = {
          'name.first': updatedUser.name?.first || '',
          'name.middle': updatedUser.name?.middle || '',
          'name.last': updatedUser.name?.last || '',
          'phone': updatedUser.phone || '',
          'email': updatedUser.email || '',
          'image.url': updatedUser.image?.url || '',
          'image.alt': updatedUser.image?.alt || '',
          'address.country': updatedUser.address?.country || '',
          'address.city': updatedUser.address?.city || '',
          'address.street': updatedUser.address?.street || '',
          'address.houseNumber': updatedUser.address?.houseNumber || '',
          'address.zip': updatedUser.address?.zip || '',
          'address.state': updatedUser.address?.state || ''
        };
                
        reset(formData, { 
          keepDirty: false, 
          keepTouched: false, 
          keepErrors: false,
          keepValues: false 
        });
        
        toast.success('הפרופיל עודכן בהצלחה!');
      } else {
        console.error('[Profile] Could not extract user data from response');
        
        try {
          const userResponse = await api.get('/users/me');          
          const freshUserData = userResponse.data?.data?.user || userResponse.data?.user || userResponse.data?.data || userResponse.data;
          
          if (freshUserData) {
            updateUser(freshUserData);
            
            const formData = {
              'name.first': freshUserData.name?.first || '',
              'name.middle': freshUserData.name?.middle || '',
              'name.last': freshUserData.name?.last || '',
              'phone': freshUserData.phone || '',
              'email': freshUserData.email || '',
              'image.url': freshUserData.image?.url || '',
              'image.alt': freshUserData.image?.alt || '',
              'address.country': freshUserData.address?.country || '',
              'address.city': freshUserData.address?.city || '',
              'address.street': freshUserData.address?.street || '',
              'address.houseNumber': freshUserData.address?.houseNumber || '',
              'address.zip': freshUserData.address?.zip || '',
              'address.state': freshUserData.address?.state || ''
            };
            
            reset(formData, { 
              keepDirty: false, 
              keepTouched: false, 
              keepErrors: false,
              keepValues: false 
            });
            
            toast.success('הפרופיל עודכן בהצלחה!');
          }
        } catch (refreshError) {
          console.error('[Profile] Error refreshing user data:', refreshError);
          toast.success('הפרופיל עודכן בהצלחה!');
        }
      }
    } catch (error) {
      if (error.response?.status === 500) {
        toast.error('שגיאה בשרת - אנא נסה שוב מאוחר יותר');
      } else if (error.response?.status === 404) {
        toast.error('משתמש לא נמצא');
      } else if (error.response?.status === 403) {
        toast.error('אין לך הרשאה לעדכן פרופיל זה');
      } else if (error.response?.status === 400) {
        toast.error(`בקשה לא תקינה: ${error.response?.data?.message || error.response?.data?.error || 'שגיאה בנתונים'}`);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'שגיאה בעדכון הפרופיל');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('הסיסמה החדשה והאישור אינם תואמים');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('הסיסמה החדשה חייבת להכיל לפחות 8 תווים');
      return;
    }

    try {
      setLoading(true);
      const userId = getUserId();
      console.log('[Profile] handlePasswordChange userId:', userId);
      
      if (!userId) {
        toast.error('שגיאה: לא ניתן לזהות את המשתמש. אנא התחבר מחדש.');
        return;
      }
      
      const response = await api.patch(`/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.status === 200) {
        toast.success('הסיסמה שונתה בהצלחה');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('[Profile] handlePasswordChange error:', error);
      
      if (error.response?.status === 404) {
        try {
          console.log('[Profile] Trying alternative password endpoint');
          const response = await api.put(`/users/${getUserId()}/password`, {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          });
          
          if (response.status === 200) {
            toast.success('הסיסמה שונתה בהצלחה');
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            return;
          }
        } catch (secondError) {
          console.error('[Profile] Second password change attempt error:', secondError);
        }
      }
      
      toast.error(error.response?.data?.message || 'שגיאה בשינוי הסיסמה');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size={32} className="spinner" />
      </div>
    );
  }

  const userData = getUserData();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <User size={24} />
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>פרופיל משתמש</h1>
      </div>

      {user && !userData?.name && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '2rem', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: 'var(--border-radius)',
          color: '#856404'
        }}>
          <strong>הערה:</strong> הנתונים המלאים שלך לא נטענו מהשרת. 
          אנא מלא את הפרטים שלך ידנית ולחץ על "שמור שינויים" כדי לשמור אותם.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Profile Information */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>פרטי משתמש</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  שם פרטי *
                </label>
                <input
                  {...register('name.first')}
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.name?.first ? 'var(--color-error)' : '#ddd'}`,
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                {errors.name?.first && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                    {errors.name.first.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  שם אמצעי
                </label>
                <input
                  {...register('name.middle')}
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  שם משפחה *
                </label>
                <input
                  {...register('name.last')}
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.name?.last ? 'var(--color-error)' : '#ddd'}`,
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                {errors.name?.last && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                    {errors.name.last.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  טלפון *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.phone ? 'var(--color-error)' : '#ddd'}`,
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                {errors.phone && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  אימייל *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.email ? 'var(--color-error)' : '#ddd'}`,
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                {errors.email && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  כתובת תמונה
                </label>
                <input
                  {...register('image.url')}
                  type="url"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors['image.url'] ? 'var(--color-error)' : '#ddd'}`,
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                {errors['image.url'] && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                    {errors['image.url'].message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  תיאור תמונה
                </label>
                <input
                  {...register('image.alt')}
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors['image.alt'] ? 'var(--color-error)' : '#ddd'}`,
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                {errors['image.alt'] && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                    {errors['image.alt'].message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div style={{ border: '1px solid #ddd', borderRadius: 'var(--border-radius)', padding: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>כתובת</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    מדינה *
                  </label>
                  <input
                    {...register('address.country')}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors['address.country'] ? 'var(--color-error)' : '#ddd'}`,
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }}
                  />
                  {errors['address.country'] && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                      {errors['address.country'].message}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    עיר *
                  </label>
                  <input
                    {...register('address.city')}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors['address.city'] ? 'var(--color-error)' : '#ddd'}`,
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }}
                  />
                  {errors['address.city'] && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                      {errors['address.city'].message}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    רחוב *
                  </label>
                  <input
                    {...register('address.street')}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors['address.street'] ? 'var(--color-error)' : '#ddd'}`,
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }}
                  />
                  {errors['address.street'] && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                      {errors['address.street'].message}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    מספר בית *
                  </label>
                  <input
                    {...register('address.houseNumber')}
                    type="number"
                    min="1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors['address.houseNumber'] ? 'var(--color-error)' : '#ddd'}`,
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }}
                  />
                  {errors['address.houseNumber'] && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                      {errors['address.houseNumber'].message}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    מיקוד
                  </label>
                  <input
                    {...register('address.zip')}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    מדינה/מחוז
                  </label>
                  <input
                    {...register('address.state')}
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                background: !saving ? 'var(--color-primary)' : '#ccc',
                color: 'white',
                cursor: !saving ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center'
              }}
            >
              {saving ? <Loader size={16} className="spinner" /> : <Save size={16} />}
              {saving ? 'שומר...' : 'שמור שינויים'}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>שינוי סיסמה</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                סיסמה נוכחית
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                סיסמה חדשה
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                אישור סיסמה חדשה
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                background: !loading && passwordData.currentPassword && passwordData.newPassword && passwordData.confirmPassword ? 'var(--color-primary)' : '#ccc',
                color: 'white',
                cursor: !loading && passwordData.currentPassword && passwordData.newPassword && passwordData.confirmPassword ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center'
              }}
            >
              {loading ? <Loader size={16} className="spinner" /> : <Save size={16} />}
              {loading ? 'משנה סיסמה...' : 'שנה סיסמה'}
            </button>
          </div>

          {/* User Info */}
          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 'var(--border-radius)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>מידע נוסף</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p><strong>תפקיד:</strong> {getUserRole()}</p>
              <p><strong>תאריך הצטרפות:</strong> {formatDate(userData?.createdAt)}</p>
              <p><strong>מספר כרטיסים:</strong> {cardsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 