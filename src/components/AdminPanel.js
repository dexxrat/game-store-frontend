import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { orderService } from '../services/orderService';
import GameFormModal from './GameFormModal';

function AdminPanel() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('games');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if (activeTab === 'games') {
        const gamesData = await gameService.getAllGames();
        setGames(gamesData);
      } else {
        const ordersData = await orderService.getAllOrders();
        setOrders(ordersData);
      }
    } catch (error) {
      setError('Ошибка загрузки данных.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      loadData();
    }
  }, [isAuthenticated, isAdmin, loadData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateGame = () => {
    setEditingGame(null);
    setModalOpen(true);
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setModalOpen(true);
  };

  const handleSaveGame = async (gameData) => {
    try {
      setSaveLoading(true);
      if (editingGame) {
        await gameService.updateGame(editingGame.id, gameData);
      } else {
        await gameService.createGame(gameData);
      }
      setModalOpen(false);
      setEditingGame(null);
      await loadData();
    } catch (error) {
      alert('Ошибка при сохранении игры.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteGame = async (gameId, gameTitle) => {
    if (window.confirm(`Удалить игру "${gameTitle}"?`)) {
      try {
        await gameService.deleteGame(gameId);
        await loadData();
      } catch (error) {
        alert('Ошибка при удалении игры');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      await loadData();
    } catch (error) {
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'status-completed';
      case 'PROCESSING': return 'status-processing';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
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

  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="container">
        <div className="text-center padding-y-4">
          <div className="card max-w-500 mx-auto padding-3">
            <h3>Доступ запрещен</h3>
            <p className="text-muted">У вас нет прав для доступа</p>
            <button onClick={() => navigate('/')} className="btn mt-2">
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && games.length === 0 && orders.length === 0) {
    return (
      <div className="container">
        <div className="text-center padding-y-4">
          <div className="card max-w-500 mx-auto padding-3">
            <h3>Загрузка...</h3>
            <p className="text-muted">Пожалуйста, подождите</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header-panel">
        <div>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            На главную
          </button>
        </div>
        <div className="text-center">
          <h2>Панель администратора</h2>
          <p className="text-dim">
            Вошли как: <strong>{user?.username}</strong>
          </p>
        </div>
        <div className="flex-center gap-1">
          <span className="admin-badge">Администратор</span>
         <button onClick={handleLogout} className="btn btn-secondary">
           Выйти
         </button>
        </div>
      </div>

      <div className="admin-tabs-panel">
        <button
          className={`admin-tab-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Управление играми
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Управление заказами
        </button>
      </div>

      {error && (
        <div className="card mb-4">
          <div className="alert-content flex-center justify-between">
            <span className="text-accent">{error}</span>
            <button onClick={loadData} className="btn btn-secondary">
              Повторить
            </button>
          </div>
        </div>
      )}

      {activeTab === 'games' ? (
        <div className="games-management">
          <div className="card mb-4">
            <div className="admin-actions text-center">
              <h3 className="mb-2">Управление каталогом игр</h3>
              <p className="text-muted mb-3">Всего игр: {games.length}</p>
              <button onClick={handleCreateGame} className="btn btn-filled">
                Добавить игру
              </button>
            </div>
          </div>

          {games.length === 0 ? (
            <div className="card text-center padding-3">
              <h3 className="text-primary mb-2">Игры не найдены</h3>
              <button onClick={handleCreateGame} className="btn btn-filled">
                Добавить первую игру
              </button>
            </div>
          ) : (
            <div className="games-list">
              {games.map(game => (
                <div key={game.id} className="card game-admin-card">
                  <img
                    src={game.imageUrl || '/default-game.jpg'}
                    alt={game.title}
                    className="game-admin-image"
                  />
                  <div className="game-admin-info">
                    <h4 className="game-admin-title">{game.title}</h4>
                    <div className="game-admin-meta">
                      <span className="game-admin-price">
                        ${game.price}
                        {game.discountPrice && (
                          <span className="text-dim ml-1" style={{textDecoration: 'line-through'}}>
                            ${game.discountPrice}
                          </span>
                        )}
                      </span>
                      <span className="game-admin-genres">
                        Жанры: {game.genres?.join(', ') || 'Не указаны'}
                      </span>
                    </div>
                    {game.description && (
                      <p className="game-admin-description">
                        {game.description.substring(0, 100)}...
                      </p>
                    )}
                    <div className="game-admin-details">
                      <span>Платформа: {game.platform}</span>
                      {game.releaseDate && (
                        <span>Дата выхода: {new Date(game.releaseDate).toLocaleDateString('ru-RU')}</span>
                      )}
                    </div>
                  </div>
                  <div className="game-admin-actions">
                    <button className="btn" onClick={() => handleEditGame(game)}>
                      Редактировать
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteGame(game.id, game.title)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="orders-management">
          <div className="card mb-4">
            <div className="admin-actions text-center">
              <h3 className="mb-2">Управление заказами</h3>
              <p className="text-muted">Всего заказов: {orders.length}</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="card text-center padding-3">
              <h3 className="text-primary mb-1">Заказы не найдены</h3>
            </div>
          ) : (
            <div className="orders-admin-list">
              {orders.map(order => (
                <div key={order.id} className="card order-admin-card">
                  <div className="order-admin-content">
                    <div className="order-admin-info">
                      <div className="order-admin-header">
                        <h4 className="order-admin-id">Заказ #{order.id}</h4>
                        <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="order-admin-details">
                        <p><strong>Пользователь:</strong> {order.userName || 'Неизвестно'}</p>
                        <p><strong>Email:</strong> {order.userEmail || 'Нет данных'}</p>
                        <p><strong>Дата:</strong> {new Date(order.orderDate).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                        <p><strong>Сумма:</strong> <span className="order-total">${order.totalAmount}</span></p>
                      </div>
                      <div className="order-admin-items">
                        <strong className="order-items-title">Товары:</strong>
                        {order.items?.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="order-item-name">
                              <strong>{item.gameTitle}</strong>
                            </div>
                            <div className="order-item-price">
                              ${item.priceAtPurchase}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="order-admin-controls">
                      <label className="order-status-label">Статус:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="form-select"
                      >
                        <option value="PENDING">Ожидание</option>
                        <option value="PROCESSING">Обработка</option>
                        <option value="COMPLETED">Завершен</option>
                        <option value="CANCELLED">Отменен</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <GameFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGame(null);
        }}
        onSave={handleSaveGame}
        game={editingGame}
        loading={saveLoading}
      />
    </div>
  );
}

export default AdminPanel;