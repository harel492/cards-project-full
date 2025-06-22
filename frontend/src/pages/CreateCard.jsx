import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const schema = yup.object().shape({
  title: yup.string().min(2, 'כותרת חייבת להיות לפחות 2 תווים').max(100, 'כותרת לא יכולה לעלות על 100 תווים').required('שדה חובה'),
  subtitle: yup.string().min(2, 'כותרת משנה חייבת להיות לפחות 2 תווים').max(100, 'כותרת משנה לא יכולה לעלות על 100 תווים').required('שדה חובה'),
  description: yup.string().min(2, 'תיאור חייב להיות לפחות 2 תווים').max(1000, 'תיאור לא יכול לעלות על 1000 תווים').required('שדה חובה'),
  phone: yup.string()
    .matches(/^0[2-9]\d{7,8}$/, 'מספר טלפון חייב להיות מספר ישראלי תקין (למשל: 050-0000000)')
    .required('שדה חובה'),
  email: yup.string().email('כתובת אימייל לא תקינה').required('שדה חובה'),
  web: yup.string()
    .matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'כתובת אתר לא תקינה')
    .optional(),
  image: yup.object().shape({
    url: yup.string().url('כתובת תמונה לא תקינה').optional(),
    alt: yup.string().max(100, 'תיאור תמונה לא יכול לעלות על 100 תווים').optional()
  }),
  address: yup.object().shape({
    state: yup.string().max(50, 'מדינה/מחוז לא יכולה לעלות על 50 תווים').optional(),
    country: yup.string().min(2, 'מדינה חייבת להיות לפחות 2 תווים').max(50, 'מדינה לא יכולה לעלות על 50 תווים').required('שדה חובה'),
    city: yup.string().min(2, 'עיר חייבת להיות לפחות 2 תווים').max(50, 'עיר לא יכולה לעלות על 50 תווים').required('שדה חובה'),
    street: yup.string().min(2, 'רחוב חייב להיות לפחות 2 תווים').max(100, 'רחוב לא יכול לעלות על 100 תווים').required('שדה חובה'),
    houseNumber: yup.number().integer().min(1, 'מספר בית חייב להיות לפחות 1').required('שדה חובה'),
    zip: yup.string().max(20, 'מיקוד לא יכול לעלות על 20 תווים').optional()
  }).required('שדה חובה')
});

export default function CreateCard() {
  const { isBusiness, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image: { url: '', alt: '' },
      address: { state: '', zip: '' },
      web: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/cards', data);
      if (response.data.success) {
        toast.success('הכרטיס נוצר בהצלחה!');
        navigate('/my-cards');
      } else {
        toast.error('שגיאה ביצירת הכרטיס');
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'שגיאה ביצירת הכרטיס');
    } finally {
      setLoading(false);
    }
  };

  if (!isBusiness && !isAdmin) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>יצירת כרטיס ביקור</h1>
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

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1>יצירת כרטיס ביקור חדש</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <h3>פרטי הכרטיס</h3>
          
          <label htmlFor="title">כותרת *</label>
          <input id="title" {...register('title')} placeholder="כותרת הכרטיס" />
          {errors.title && <div className="error">{errors.title.message}</div>}

          <label htmlFor="subtitle">כותרת משנה *</label>
          <input id="subtitle" {...register('subtitle')} placeholder="כותרת משנה" />
          {errors.subtitle && <div className="error">{errors.subtitle.message}</div>}

          <label htmlFor="description">תיאור *</label>
          <textarea 
            id="description" 
            {...register('description')} 
            placeholder="תיאור מפורט של העסק"
            rows={4}
          />
          {errors.description && <div className="error">{errors.description.message}</div>}
        </div>

        <div className="card">
          <h3>פרטי קשר</h3>
          
          <label htmlFor="phone">טלפון *</label>
          <input id="phone" type="tel" {...register('phone')} placeholder="050-0000000" />
          {errors.phone && <div className="error">{errors.phone.message}</div>}

          <label htmlFor="email">אימייל *</label>
          <input id="email" type="email" {...register('email')} placeholder="example@email.com" />
          {errors.email && <div className="error">{errors.email.message}</div>}

          <label htmlFor="web">אתר אינטרנט</label>
          <input id="web" type="url" {...register('web')} placeholder="https://www.example.com" />
          {errors.web && <div className="error">{errors.web.message}</div>}
        </div>

        <div className="card">
          <h3>תמונה</h3>
          
          <label htmlFor="imageUrl">כתובת תמונה</label>
          <input id="imageUrl" type="url" {...register('image.url')} placeholder="https://example.com/image.jpg" />
          {errors.image?.url && <div className="error">{errors.image.url.message}</div>}

          <label htmlFor="imageAlt">תיאור התמונה</label>
          <input id="imageAlt" {...register('image.alt')} placeholder="תיאור התמונה" />
          {errors.image?.alt && <div className="error">{errors.image.alt.message}</div>}
        </div>

        <div className="card">
          <h3>כתובת</h3>
          
          <div className="flex">
            <div style={{ flex: 1 }}>
              <label htmlFor="country">מדינה *</label>
              <input id="country" {...register('address.country')} placeholder="ישראל" />
              {errors.address?.country && <div className="error">{errors.address.country.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="state">מדינה/מחוז</label>
              <input id="state" {...register('address.state')} placeholder="תל אביב" />
              {errors.address?.state && <div className="error">{errors.address.state.message}</div>}
            </div>
          </div>

          <div className="flex">
            <div style={{ flex: 1 }}>
              <label htmlFor="city">עיר *</label>
              <input id="city" {...register('address.city')} placeholder="תל אביב" />
              {errors.address?.city && <div className="error">{errors.address.city.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="zip">מיקוד</label>
              <input id="zip" {...register('address.zip')} placeholder="12345" />
              {errors.address?.zip && <div className="error">{errors.address.zip.message}</div>}
            </div>
          </div>

          <div className="flex">
            <div style={{ flex: 2 }}>
              <label htmlFor="street">רחוב *</label>
              <input id="street" {...register('address.street')} placeholder="דרך מנחם בגין" />
              {errors.address?.street && <div className="error">{errors.address.street.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="houseNumber">מספר בית *</label>
              <input id="houseNumber" type="number" {...register('address.houseNumber')} placeholder="1" />
              {errors.address?.houseNumber && <div className="error">{errors.address.houseNumber.message}</div>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button type="button" onClick={() => navigate('/my-cards')} style={{ background: 'var(--color-secondary)' }}>
            ביטול
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'יוצר...' : 'צור כרטיס'}
          </button>
        </div>
      </form>
    </div>
  );
} 