import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const loadCartFromServer = useCallback(async () => {
    if (!isAuthenticated()) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();

      if (response && Array.isArray(response.items)) {
        const serverCartItems = response.items.map(item => ({
          id: item.id,
          gameId: item.gameId,
          title: item.gameTitle || 'Unknown Game',
          price: parseFloat(item.price) || 0,
          imageUrl: item.imageUrl || '/default-game.jpg',
          platform: item.platform || '',
          quantity: parseInt(item.quantity) || 1
        }));
        setCartItems(serverCartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCartFromServer();
  }, [loadCartFromServer]);

  const addToCart = async (game) => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Пожалуйста, войдите в систему для добавления в корзину');
      }

      await cartService.addToCart(game.id, 1);
      await loadCartFromServer();
      return { success: true, message: 'Игра добавлена в корзину!' };
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem) return;

      await cartService.updateCartItem(cartItem.id, newQuantity);
      await loadCartFromServer();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem) return;

      await cartService.removeCartItem(cartItem.id);
      await loadCartFromServer();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      setCartItems([]);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 0);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const isInCart = (gameId) => {
    return cartItems.some(item => item.gameId === gameId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    loadCartFromServer,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};