import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderService.getUserOrders();
      const ordersArray = Array.isArray(response) ? response : [];
      setOrders(ordersArray);
    } catch (error) {
      setError(error.message || 'Ошибка при загрузке заказов');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'Завершен';
      case 'PROCESSING': return 'В обработке';
      case 'PENDING': return 'Ожидание';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="container">
        <div className="text-center padding-y-4">
          <div className="card max-w-500 mx-auto padding-3">
            <h2>Доступ запрещен</h2>
            <p className="text-muted">Пожалуйста, войдите в систему для просмотра заказов.</p>
            <Link to="/login" className="btn mt-2">
              Войти в систему
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>История заказов</h1>
        <p className="text-muted">Ваши покупки в ZenGame</p>
      </div>

      <div className="user-profile">
        <div className="user-avatar">
          <span className="material-icons">person</span>
        </div>
        <div className="user-info">
          <h3>{user?.username}</h3>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="refresh-btn text-center mb-4">
        <button onClick={loadOrders} className="btn btn-secondary" disabled={loading}>
          {loading ? 'Обновление...' : 'Обновить список'}
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Загрузка заказов...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="card max-w-500 mx-auto my-2 padding-2">
            <h3 className="mb-2">Ошибка</h3>
            <p className="mb-3 text-muted">{error}</p>
            <button onClick={loadOrders} className="btn">
              Попробовать снова
            </button>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <div className="card max-w-500 mx-auto my-2 padding-3">
            <h3 className="mb-2">Заказов пока нет</h3>
            <Link to="/games" className="btn">
              Перейти к играм
            </Link>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="card order-card">
              <img
                src={order.items?.[0]?.imageUrl || '/default-game.jpg'}
                alt={order.items?.[0]?.gameTitle || 'Game'}
                className="order-image"
              />
              <div className="order-info">
                <div className="order-header">
                  <div>
                    <h3 className="order-id">Заказ #{order.id}</h3>
                    <p className="order-date text-muted">
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <span className="order-status">
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-items">
                  <h4 className="mb-2">Состав заказа:</h4>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div>
                          <strong>{item.gameTitle}</strong>
                        </div>
                        <div className="text-primary">
                          ${item.priceAtPurchase?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Нет информации о товарах</p>
                  )}
                </div>

                <div className="order-total mt-3 text-right">
                  <strong>Итого: ${order.totalAmount?.toFixed(2) || '0.00'}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;