import api from './api';

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/api/auth/login', { username, password });

      if (response && response.token) {
        localStorage.setItem('authToken', response.token);

        const userData = {
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles || ['ROLE_USER']
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return { ...response, ...userData };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      let userMessage = 'Ошибка входа';
      if (error.message?.includes('Invalid credentials') || error.message?.includes('Неверные учетные данные')) {
        userMessage = 'Неверное имя пользователя или пароль';
      } else if (error.message?.includes('400')) {
        userMessage = 'Неверные данные для входа';
      } else if (error.message?.includes('401')) {
        userMessage = 'Неверные учетные данные';
      } else if (error.message) {
        userMessage = error.message;
      }

      throw new Error(userMessage);
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password
      });

      if (response && response.token) {
        localStorage.setItem('authToken', response.token);

        const newUserData = {
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles || ['ROLE_USER']
        };

        localStorage.setItem('user', JSON.stringify(newUserData));
        return { ...response, ...newUserData };
      } else {
        throw new Error('Ошибка регистрации - токен не получен');
      }
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      this.logout();
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.logout();
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes('ROLE_ADMIN');
  }
};