import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const schema = yup.object().shape({
  name: yup.object().shape({
    first: yup.string().min(2, 'שם פרטי חייב להיות לפחות 2 תווים').max(50, 'שם פרטי לא יכול לעלות על 50 תווים').required('שדה חובה'),
    middle: yup.string().max(50, 'שם אמצעי לא יכול לעלות על 50 תווים'),
    last: yup.string().min(2, 'שם משפחה חייב להיות לפחות 2 תווים').max(50, 'שם משפחה לא יכול לעלות על 50 תווים').required('שדה חובה'),
  }),
  phone: yup.string()
    .matches(/^0[2-9]\d{7,8}$/, 'מספר טלפון חייב להיות מספר ישראלי תקין (למשל: 050-0000000)')
    .required('שדה חובה'),
  email: yup.string().email('כתובת אימייל לא תקינה').required('שדה חובה'),
  password: yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{8,}$/, 'סיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד (!@#$%^&*-_)')
    .required('שדה חובה'),
  address: yup.object().shape({
    state: yup.string().max(50, 'מדינה לא יכולה לעלות על 50 תווים'),
    country: yup.string().min(2, 'מדינה חייבת להיות לפחות 2 תווים').max(50, 'מדינה לא יכולה לעלות על 50 תווים').required('שדה חובה'),
    city: yup.string().min(2, 'עיר חייבת להיות לפחות 2 תווים').max(50, 'עיר לא יכולה לעלות על 50 תווים').required('שדה חובה'),
    street: yup.string().min(2, 'רחוב חייב להיות לפחות 2 תווים').max(100, 'רחוב לא יכול לעלות על 100 תווים').required('שדה חובה'),
    houseNumber: yup.number().integer().min(1, 'מספר בית חייב להיות לפחות 1').required('שדה חובה'),
    zip: yup.string().max(20, 'מיקוד לא יכול לעלות על 20 תווים'),
  }),
  isBusiness: yup.boolean().default(false),
});

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: { middle: '' },
      address: { state: '', zip: '' },
      isBusiness: false,
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/users', data);
      if (response.data.success) {
        toast.success('נרשמת בהצלחה! אנא התחבר');
        navigate('/login');
      } else {
        toast.error('שגיאה בהרשמה');
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h2>הרשמה</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <h3>פרטים אישיים</h3>
          
          <div className="flex">
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName">שם פרטי *</label>
              <input id="firstName" {...register('name.first')} />
              {errors.name?.first && <div className="error">{errors.name.first.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="middleName">שם אמצעי</label>
              <input id="middleName" {...register('name.middle')} />
              {errors.name?.middle && <div className="error">{errors.name.middle.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName">שם משפחה *</label>
              <input id="lastName" {...register('name.last')} />
              {errors.name?.last && <div className="error">{errors.name.last.message}</div>}
            </div>
          </div>

          <label htmlFor="phone">טלפון *</label>
          <input id="phone" type="tel" {...register('phone')} placeholder="050-0000000" />
          {errors.phone && <div className="error">{errors.phone.message}</div>}

          <label htmlFor="email">אימייל *</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <div className="error">{errors.email.message}</div>}

          <label htmlFor="password">סיסמה *</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <div className="error">{errors.password.message}</div>}
        </div>

        <div className="card">
          <h3>כתובת</h3>
          
          <div className="flex">
            <div style={{ flex: 1 }}>
              <label htmlFor="country">מדינה *</label>
              <input id="country" {...register('address.country')} />
              {errors.address?.country && <div className="error">{errors.address.country.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="state">מדינה/מחוז</label>
              <input id="state" {...register('address.state')} />
              {errors.address?.state && <div className="error">{errors.address.state.message}</div>}
            </div>
          </div>

          <div className="flex">
            <div style={{ flex: 1 }}>
              <label htmlFor="city">עיר *</label>
              <input id="city" {...register('address.city')} />
              {errors.address?.city && <div className="error">{errors.address.city.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="zip">מיקוד</label>
              <input id="zip" {...register('address.zip')} />
              {errors.address?.zip && <div className="error">{errors.address.zip.message}</div>}
            </div>
          </div>

          <div className="flex">
            <div style={{ flex: 2 }}>
              <label htmlFor="street">רחוב *</label>
              <input id="street" {...register('address.street')} />
              {errors.address?.street && <div className="error">{errors.address.street.message}</div>}
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="houseNumber">מספר בית *</label>
              <input id="houseNumber" type="number" {...register('address.houseNumber')} />
              {errors.address?.houseNumber && <div className="error">{errors.address.houseNumber.message}</div>}
            </div>
          </div>
        </div>

        <div className="card">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" {...register('isBusiness')} />
            <span>חשבון עסקי</span>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'טוען...' : 'הרשמה'}
        </button>
      </form>
    </div>
  );
} 