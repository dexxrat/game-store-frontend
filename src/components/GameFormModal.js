import React, { useState, useEffect } from 'react';

function GameFormModal({ isOpen, onClose, onSave, game = null, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    developer: '',
    publisher: '',
    releaseDate: '',
    platform: 'PC',
    imageUrl: '',
    genres: []
  });
  const [selectedGenre, setSelectedGenre] = useState('');

  const availableGenres = [
    'ACTION', 'RPG', 'STRATEGY', 'ADVENTURE', 'SIMULATION', 'SPORTS',
    'RACING', 'HORROR', 'PUZZLE', 'FIGHTING', 'SHOOTER', 'INDIE'
  ];

  const platforms = ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO', 'MOBILE'];

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || '',
        description: game.description || '',
        price: game.price || '',
        discountPrice: game.discountPrice || '',
        developer: game.developer || '',
        publisher: game.publisher || '',
        releaseDate: game.releaseDate || '',
        platform: game.platform || 'PC',
        imageUrl: game.imageUrl || '',
        genres: game.genres || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        discountPrice: '',
        developer: '',
        publisher: '',
        releaseDate: '',
        platform: 'PC',
        imageUrl: '',
        genres: []
      });
    }
    setSelectedGenre('');
  }, [game, isOpen]);

  const handleAddGenre = () => {
    if (selectedGenre && !formData.genres.includes(selectedGenre)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, selectedGenre]
      }));
      setSelectedGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название игры');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Пожалуйста, введите корректную цену');
      return;
    }
    if (formData.genres.length === 0) {
      alert('Пожалуйста, добавьте хотя бы один жанр');
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      genres: formData.genres
    };

    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {game ? 'Редактировать игру' : 'Добавить новую игру'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Основная информация</h3>
            <div className="form-group mb-3">
              <label className="form-label">
                Название игры *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="form-input"
                placeholder="Введите название игры"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows="4"
                className="form-input form-textarea"
                placeholder="Опишите игру"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Цены</h3>
            <div className="form-grid mb-3">
              <div className="form-group">
                <label className="form-label">
                  Цена ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Цена со скидкой ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                  className="form-input"
                  placeholder="0.00 (опционально)"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Детали</h3>
            <div className="form-grid mb-3">
              <div className="form-group">
                <label className="form-label">
                  Платформа *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  required
                  className="form-input"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Дата выхода
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Жанры *</h3>
            <div className="genres-list mb-2">
              {formData.genres.map(genre => (
                <span key={genre} className="genre-tag">
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="genre-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="genre-selector">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="form-input"
              >
                <option value="">Выберите жанр</option>
                {availableGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddGenre}
                className="btn btn-secondary"
                disabled={!selectedGenre}
              >
                Добавить жанр
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3>Изображение</h3>
            <div className="form-group">
              <label className="form-label">
                URL изображения
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-filled"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : (game ? 'Обновить игру' : 'Создать игру')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameFormModal;