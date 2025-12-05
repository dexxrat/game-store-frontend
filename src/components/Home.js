import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (genre) => {
    navigate(`/games?genre=${genre}`);
  };

  const categories = [
    { name: 'Экшен', genre: 'ACTION' },
    { name: 'RPG', genre: 'RPG' },
    { name: 'Гонки', genre: 'RACING' },
    { name: 'Стратегия', genre: 'STRATEGY' }
  ];

  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">Level Up Your Gaming Experience</h1>
        <p className="hero-subtitle">
          Откройте для себя тысячи игр на всех платформах. Мгновенная доставка, лучшие цены, эксклюзивные предложения.
        </p>

        <div className="flex-center gap-2">
          <Link to="/games" className="btn">
            Смотреть игры
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">5000+</span>
            <span className="stat-label">Игр</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Жанров</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Поддержка</span>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="text-center mb-4">Популярные категории</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.genre}
              className="category-btn"
              onClick={() => handleCategoryClick(category.genre)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;