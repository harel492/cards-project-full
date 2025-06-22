import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const schema = yup.object({
  title: yup.string().required('כותרת היא שדה חובה').min(2, 'כותרת חייבת להכיל לפחות 2 תווים').max(256, 'כותרת לא יכולה לעלות על 256 תווים'),
  subtitle: yup.string().required('תת כותרת היא שדה חובה').min(2, 'תת כותרת חייבת להכיל לפחות 2 תווים').max(256, 'תת כותרת לא יכולה לעלות על 256 תווים'),
  description: yup.string().required('תיאור הוא שדה חובה').min(2, 'תיאור חייב להכיל לפחות 2 תווים').max(1024, 'תיאור לא יכול לעלות על 1024 תווים'),
  phone: yup.string().required('טלפון הוא שדה חובה').matches(/^0[2-9]\d{7,8}$/, 'מספר טלפון חייב להיות בפורמט ישראלי תקין'),
  email: yup.string().required('אימייל הוא שדה חובה').email('אימייל חייב להיות בפורמט תקין'),
  web: yup.string().url('כתובת אתר חייבת להיות בפורמט תקין').optional(),
  'image.url': yup.string().url('כתובת תמונה חייבת להיות בפורמט תקין').optional(),
  'image.alt': yup.string().min(2, 'תיאור תמונה חייב להכיל לפחות 2 תווים').max(256, 'תיאור תמונה לא יכול לעלות על 256 תווים').optional(),
  'address.country': yup.string().required('מדינה היא שדה חובה'),
  'address.city': yup.string().required('עיר היא שדה חובה'),
  'address.street': yup.string().required('רחוב הוא שדה חובה'),
  'address.houseNumber': yup.number().required('מספר בית הוא שדה חובה').min(1, 'מספר בית חייב להיות חיובי'),
  'address.zip': yup.string().optional(),
  'address.state': yup.string().optional()
});

export default function EditCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [card, setCard] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    reset,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all'
  });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/cards/${id}`);
        
        const cardData = response.data?.data?.card || response.data?.card || response.data;
        
        if (!cardData) {
          toast.error('כרטיס לא נמצא');
          navigate('/my-cards');
          return;
        }
        
        const cardOwnerId = cardData.user_id?._id || cardData.user_id;
        const currentUserId = user?._id?.toString();
        
        if (cardOwnerId?.toString() !== currentUserId && !isAdmin) {
          toast.error('אין לך הרשאה לערוך כרטיס זה');
          navigate('/my-cards');
          return;
        }

        setCard(cardData);
        
        const formData = {
          title: cardData.title,
          subtitle: cardData.subtitle,
          description: cardData.description,
          phone: cardData.phone,
          email: cardData.email,
          web: cardData.web || '',
          'image.url': cardData.image?.url || '',
          'image.alt': cardData.image?.alt || '',
          'address.country': cardData.address?.country || '',
          'address.city': cardData.address?.city || '',
          'address.street': cardData.address?.street || '',
          'address.houseNumber': cardData.address?.houseNumber || '',
          'address.zip': cardData.address?.zip || '',
          'address.state': cardData.address?.state || ''
        };
        
        reset(formData);
        
      } catch (error) {
        toast.error('שגיאה בטעינת הכרטיס');
        navigate('/my-cards');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCard();
    }
  }, [id, user, isAdmin, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      
      const cardData = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        phone: data.phone,
        email: data.email,
        web: data.web || undefined,
        image: {
          url: data['image.url'] || undefined,
          alt: data['image.alt'] || undefined
        },
        address: {
          country: data['address.country'],
          city: data['address.city'],
          street: data['address.street'],
          houseNumber: parseInt(data['address.houseNumber']),
          zip: data['address.zip'] || undefined,
          state: data['address.state'] || undefined
        }
      };

      const response = await api.put(`/cards/${id}`, cardData);
      
      if (response.status === 200) {
        toast.success('הכרטיס עודכן בהצלחה');
        navigate('/my-cards');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'שגיאה בעדכון הכרטיס');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size={32} className="spinner" />
      </div>
    );
  }

  if (!card) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>כרטיס לא נמצא</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/my-cards')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-primary)'
          }}
        >
          <ArrowLeft size={20} />
          חזרה לכרטיסים שלי
        </button>
      </div>

      <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>עריכת כרטיס ביקור</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Basic Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              כותרת *
            </label>
            <input
              {...register('title')}
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.title ? 'var(--color-error)' : '#ddd'}`,
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem'
              }}
            />
            {errors.title && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              תת כותרת *
            </label>
            <input
              {...register('subtitle')}
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.subtitle ? 'var(--color-error)' : '#ddd'}`,
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem'
              }}
            />
            {errors.subtitle && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                {errors.subtitle.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            תיאור *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.description ? 'var(--color-error)' : '#ddd'}`,
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          {errors.description && (
            <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              טלפון *
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="050-0000000"
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

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              אתר אינטרנט
            </label>
            <input
              {...register('web')}
              type="url"
              placeholder="https://www.example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.web ? 'var(--color-error)' : '#ddd'}`,
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem'
              }}
            />
            {errors.web && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                {errors.web.message}
              </p>
            )}
          </div>
        </div>

        {/* Image */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              כתובת תמונה
            </label>
            <input
              {...register('image.url')}
              type="url"
              placeholder="https://example.com/image.jpg"
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
              placeholder="תיאור התמונה"
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
        <div style={{ border: '1px solid #ddd', borderRadius: 'var(--border-radius)', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>כתובת</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                  border: `1px solid ${errors['address.zip'] ? 'var(--color-error)' : '#ddd'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1rem'
                }}
              />
              {errors['address.zip'] && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                  {errors['address.zip'].message}
                </p>
              )}
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
                  border: `1px solid ${errors['address.state'] ? 'var(--color-error)' : '#ddd'}`,
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1rem'
                }}
              />
              {errors['address.state'] && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.9em', marginTop: '0.25rem' }}>
                  {errors['address.state'].message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/my-cards')}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #ddd',
              borderRadius: 'var(--border-radius)',
              background: 'white',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ביטול
          </button>
          
          <button
            type="submit"
            disabled={!isValid || saving}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              background: isValid && !saving ? 'var(--color-primary)' : '#ccc',
              color: 'white',
              cursor: isValid && !saving ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {saving ? <Loader size={16} className="spinner" /> : <Save size={16} />}
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </form>
    </div>
  );
} 