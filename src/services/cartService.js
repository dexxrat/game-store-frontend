import api from './api';

export const cartService = {
  async getCart() {
    return await api.get('/api/cart');
  },

  async addToCart(gameId, quantity = 1) {
    return await api.post('/api/cart/items', {
      gameId: parseInt(gameId),
      quantity: parseInt(quantity)
    });
  },

  async updateCartItem(itemId, quantity) {
    return await api.put(`/api/cart/items/${itemId}`, {
      quantity: parseInt(quantity)
    });
  },

  async removeCartItem(itemId) {
    return await api.delete(`/api/cart/items/${itemId}`);
  },

  async clearCart() {
    return await api.delete('/api/cart');
  }
};