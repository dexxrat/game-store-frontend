import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.username.length < 3) {
      return 'Имя пользователя должно быть не менее 3 символов';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Пожалуйста, введите корректный email адрес';
    }
    if (formData.password.length < 6) {
      return 'Пароль должен быть не менее 6 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Пароли не совпадают';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      navigate('/login', {
        state: { message: 'Регистрация успешна! Пожалуйста, войдите в систему.' }
      });
    } catch (error) {
      setError(error.message || 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="card auth-card">
          <h2 className="auth-title">Создание аккаунта</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Имя пользователя</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Придумайте имя пользователя"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                minLength="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email адрес</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Введите ваш email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Придумайте пароль"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Подтверждение пароля</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                minLength="6"
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="terms">
            <p className="text-muted">
              Регистрируясь, вы соглашаетесь с нашими Условиями обслуживания и Политикой конфиденциальности
            </p>
          </div>

          <div className="text-center mt-3">
            <p className="text-muted">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="auth-link">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;