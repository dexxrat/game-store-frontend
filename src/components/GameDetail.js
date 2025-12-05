import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const loadGame = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const gameData = await gameService.getGameById(id);
      setGame(gameData);
    } catch (error) {
      setError('Игра не найдена.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleAddToCart = async () => {
    if (!game) return;

    setAddingToCart(true);
    try {
      await addToCart(game);
      alert('Игра добавлена в корзину!');
    } catch (error) {
      alert(error.message || 'Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isGameInCart = isInCart(game?.id);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getGenresText = () => {
    if (game?.genres && Array.isArray(game.genres)) {
      return game.genres.join(', ');
    }
    return game?.genre || 'Не указаны';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="text-center">
            <h3>Загрузка игры...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="card max-w-500 mx-auto my-2">
            <h3 className="mb-2">Ошибка</h3>
            <p className="mb-3 text-muted">
              {error || 'Игра не найдена'}
            </p>
            <div className="flex-center gap-1">
              <button onClick={handleBack} className="btn btn-secondary">
                Назад
              </button>
              <button onClick={loadGame} className="btn">
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={handleBack} className="btn-back">
        <span className="material-icons">arrow_back</span>
        Назад к каталогу
      </button>

      <div className="game-detail-grid">
        {/* Левая часть - изображение */}
        <div className="game-detail-image-section">
          <div className="card image-container">
            <img
              src={imageError ? '/default-game.jpg' : (game.imageUrl || '/default-game.jpg')}
              alt={game.title}
              className="game-detail-image"
              onError={handleImageError}
            />
            {game.discountPrice && game.discountPrice < game.price && (
              <div className="discount-badge-large">
                -{Math.round((1 - game.discountPrice / game.price) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Правая часть - информация */}
        <div className="game-detail-info-section">
          <div className="card">
            <h1 className="game-detail-title">{game.title}</h1>

            <p className="game-detail-description">
              {game.description || 'Описание отсутствует'}
            </p>

            <div className="game-detail-meta">
              <div className="meta-item">
                <strong>Жанр:</strong>
                <span>{getGenresText()}</span>
              </div>

              {game.releaseDate && (
                <div className="meta-item">
                  <strong>Дата выхода:</strong>
                  <span>{formatDate(game.releaseDate)}</span>
                </div>
              )}

              {game.platform && (
                <div className="meta-item">
                  <strong>Платформа:</strong>
                  <span>{game.platform}</span>
                </div>
              )}

              {game.developer && (
                <div className="meta-item">
                  <strong>Разработчик:</strong>
                  <span>{game.developer}</span>
                </div>
              )}

              {game.publisher && (
                <div className="meta-item">
                  <strong>Издатель:</strong>
                  <span>{game.publisher}</span>
                </div>
              )}
            </div>

            <div className="game-detail-price-section">
              {game.discountPrice && game.discountPrice < game.price ? (
                <div className="discount-prices-large">
                  <span className="original-price-large">${game.price}</span>
                  <span className="current-price-large">${game.discountPrice}</span>
                </div>
              ) : (
                <span className="current-price-large">${game.price}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !game || isGameInCart || !isAuthenticated()}
              className={`add-to-cart-btn-large ${isGameInCart ? 'in-cart' : ''}`}
            >
              {addingToCart ? (
                <>
                  <span className="material-icons">hourglass_empty</span>
                  Добавление...
                </>
              ) : isGameInCart ? (
                <>
                  <span className="material-icons">check_circle</span>
                  В корзине
                </>
              ) : (
                <>
                  <span className="material-icons">shopping_cart</span>
                  Добавить в корзину
                </>
              )}
            </button>

            {!isAuthenticated() && (
              <p className="login-warning">
                <span className="material-icons">warning</span>
                Войдите в систему для добавления в корзину
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Дополнительная информация (опционально) */}
      {(game.developer || game.publisher || game.genre) && (
        <div className="card mt-4">
          <h3 className="mb-3">Детали игры</h3>
          <div className="game-specs-grid">
            {game.developer && (
              <div className="spec-item">
                <span className="spec-label">Разработчик</span>
                <span className="spec-value">{game.developer}</span>
              </div>
            )}

            {game.publisher && (
              <div className="spec-item">
                <span className="spec-label">Издатель</span>
                <span className="spec-value">{game.publisher}</span>
              </div>
            )}

            {game.genre && (
              <div className="spec-item">
                <span className="spec-label">Основной жанр</span>
                <span className="spec-value">{game.genre}</span>
              </div>
            )}

            {game.platform && (
              <div className="spec-item">
                <span className="spec-label">Платформа</span>
                <span className="spec-value">{game.platform}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetail;