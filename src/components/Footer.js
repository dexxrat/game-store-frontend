import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>О ZenStore</h3>
            <p className="footer-text">
              Ваш идеальный магазин для новейших и лучших игр на всех платформах.
            </p>
          </div>

          <div className="footer-section">
            <h3>Поддержка</h3>
            <ul className="footer-list">
              <li><Link to="/contact">Контакты</Link></li>
              <li><Link to="/delivery">Доставка</Link></li>
              <li><Link to="/returns">Возвраты</Link></li>
              <li><Link to="/faq">Частые вопросы</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Быстрые ссылки</h3>
            <ul className="footer-list">
              <li><Link to="/account">Мой аккаунт</Link></li>
              <li><Link to="/wishlist">Избранное</Link></li>
              <li><Link to="/privacy">Политика конфиденциальности</Link></li>
              <li><Link to="/terms">Условия обслуживания</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Сообщество</h3>
            <p className="footer-text">Присоединяйтесь к нашему игровому сообществу</p>
            <div className="social-links">
              <a href="#" className="social-link">Discord</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Twitch</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 ZenStore. Все права защищены. Играйте!</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;