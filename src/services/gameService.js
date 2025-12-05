import api from './api';

export const gameService = {
  async getAllGames() {
    const games = await api.get('/api/games');
    return games || [];
  },

  async getGameById(id) {
    return await api.get(`/api/games/${id}`);
  },

  async searchGames(query) {
    const games = await api.get(`/api/games/search?query=${encodeURIComponent(query)}`);
    return games || [];
  },

  async getGamesByGenre(genre) {
    const games = await api.get(`/api/games/genre/${encodeURIComponent(genre)}`);
    return games || [];
  },

  async createGame(gameData) {
    return await api.post('/api/games/admin', gameData);
  },

  async updateGame(id, gameData) {
    return await api.put(`/api/games/admin/${id}`, gameData);
  },

  async deleteGame(id) {
    return await api.delete(`/api/games/admin/${id}`);
  }
};