import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup.string().email('כתובת אימייל לא תקינה').required('שדה חובה'),
  password: yup.string().required('שדה חובה'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('התחברת בהצלחה!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">אימייל</label>
        <input id="email" type="email" {...register('email')} autoComplete="username" />
        {errors.email && <div className="error">{errors.email.message}</div>}

        <label htmlFor="password">סיסמה</label>
        <input id="password" type="password" {...register('password')} autoComplete="current-password" />
        {errors.password && <div className="error">{errors.password.message}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'טוען...' : 'התחבר'}
        </button>
      </form>
    </div>
  );
} 