import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Пожалуйста, введите имя пользователя');
      return;
    }

    if (!formData.password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Неверное имя пользователя или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="card auth-card">
          <h2 className="auth-title">Добро пожаловать в ZenStore</h2>
          <p className="text-center text-muted mb-4">Присоединяйтесь к игровому сообществу</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Имя пользователя</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Введите ваше имя пользователя"
                value={formData.username}
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
                placeholder="Введите ваш пароль"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
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
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted">
              Нет аккаунта?{' '}
              <Link to="/register" className="auth-link">
                Зарегистрируйтесь
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;