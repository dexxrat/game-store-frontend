import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    loadCartFromServer,
    loading: cartLoading
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      setError('Пожалуйста, войдите в систему для оформления заказа');
      return;
    }

    if (cartItems.length === 0) {
      setError('Корзина пуста.');
      return;
    }

    setCheckoutLoading(true);
    setError('');
    setSuccess('');

    try {
      await orderService.checkout();
      await clearCart();
      setSuccess('Заказ успешно оформлен!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      setError('Ошибка при оформлении заказа.');
      await loadCartFromServer();
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cartItems.length === 0 && !cartLoading) {
    return (
      <div className="container">
        <div className="text-center padding-y-4">
          <div className="card max-w-500 mx-auto padding-3">
            <h2 className="mb-2">Корзина пуста</h2>
            <Link to="/games" className="btn">
              Перейти к играм
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = cartLoading || checkoutLoading;

  return (
    <div className="container">
      <h1 className="text-center mb-4">Корзина покупок</h1>

      {isAuthenticated() && (
        <div className="user-profile mb-4">
          <div className="user-avatar">
            <span className="material-icons">person</span>
          </div>
          <div className="user-info">
            <h3>{user?.username}</h3>
            <p>Email: {user?.email}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mb-3">
          <div className="alert-content">
            <span>{error}</span>
            <button onClick={() => setError('')} className="alert-close">
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-3">
          <div className="alert-content">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="alert-close">
              ×
            </button>
          </div>
        </div>
      )}

      {cartLoading ? (
        <div className="text-center">
          <p>Загрузка корзины...</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="card cart-item">
                <img
                  src={item.imageUrl || '/default-game.jpg'}
                  alt={item.title}
                  className="cart-image"
                />
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p className="text-muted">{item.platform}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isLoading}
                    className="btn btn-secondary"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="btn btn-secondary"
                    disabled={isLoading}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-price">
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  <p className="text-dim">${item.price} каждый</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn btn-danger"
                  disabled={isLoading}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <h3>Итого: ${getTotalPrice().toFixed(2)}</h3>
              <p className="text-muted">{getTotalItems()} товар(ов)</p>
            </div>
            <div className="cart-actions">
              <button onClick={clearCart} className="btn btn-secondary" disabled={isLoading}>
                Очистить корзину
              </button>
              <button
                onClick={handleCheckout}
                disabled={isLoading || cartItems.length === 0 || !isAuthenticated()}
                className="btn btn-primary"
              >
                {checkoutLoading ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;