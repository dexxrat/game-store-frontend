import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function GameCard({ game }) {
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (addingToCart) return;

    setAddingToCart(true);
    try {
      await addToCart(game);
    } catch (error) {
      alert(error.message || 'Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/games/${game.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isGameInCart = isInCart(game.id);

  const getGameGenre = () => {
    if (game.genre) return game.genre;
    if (game.genres && Array.isArray(game.genres) && game.genres.length > 0) {
      return game.genres[0];
    }
    return 'Жанр не указан';
  };

  // Обрезаем описание до 2 строк
  const getShortDescription = () => {
    if (!game.description) return 'Описание отсутствует';
    return game.description.length > 100
      ? `${game.description.substring(0, 100)}...`
      : game.description;
  };

  // Обрезаем название до 2 строк
  const getShortTitle = () => {
    return game.title.length > 40
      ? `${game.title.substring(0, 40)}...`
      : game.title;
  };

  return (
    <div className="card game-card" onClick={handleCardClick}>
      <div className="game-card-image">
        <img
          src={imageError ? '/default-game.jpg' : (game.imageUrl || '/default-game.jpg')}
          alt={game.title}
          className="game-image"
          onError={handleImageError}
        />
        {game.discountPrice && game.discountPrice < game.price && (
          <div className="discount-badge">
            -{Math.round((1 - game.discountPrice / game.price) * 100)}%
          </div>
        )}
      </div>

      <div className="game-card-content">
        <h3 className="game-title" title={game.title}>
          {getShortTitle()}
        </h3>

        <p className="game-description" title={game.description}>
          {getShortDescription()}
        </p>

        <div className="game-meta">
          <span className="game-genre" title={getGameGenre()}>
            {getGameGenre()}
          </span>
        </div>

        <div className="game-price-section">
          {game.discountPrice && game.discountPrice < game.price ? (
            <div className="discount-prices">
              <span className="original-price" title={`$${game.price}`}>
                ${game.price}
              </span>
              <span className="current-price" title={`$${game.discountPrice}`}>
                ${game.discountPrice}
              </span>
            </div>
          ) : (
            <span className="current-price" title={`$${game.price}`}>
              ${game.price}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`add-to-cart-btn ${isGameInCart ? 'in-cart' : ''}`}
          disabled={addingToCart}
          title={isGameInCart ? 'Уже в корзине' : 'Добавить в корзину'}
        >
          {addingToCart ? (
            <>
              <span className="material-icons" style={{ fontSize: '1rem' }}>hourglass_empty</span>
              Добавление...
            </>
          ) : isGameInCart ? (
            <>
              <span className="material-icons" style={{ fontSize: '1rem' }}>check_circle</span>
              В корзине
            </>
          ) : (
            <>
              <span className="material-icons" style={{ fontSize: '1rem' }}>shopping_cart</span>
              В корзину
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default GameCard;