import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gameService } from '../services/gameService';
import GameCard from './GameCard';

function GameList() {
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const genres = [
    { value: '', label: 'Все жанры' },
    { value: 'ACTION', label: 'Экшен' },
    { value: 'RPG', label: 'RPG' },
    { value: 'STRATEGY', label: 'Стратегия' },
    { value: 'ADVENTURE', label: 'Приключения' },
    { value: 'SIMULATION', label: 'Симулятор' },
    { value: 'SPORTS', label: 'Спорт' },
    { value: 'RACING', label: 'Гонки' },
    { value: 'HORROR', label: 'Хоррор' }
  ];

  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const gamesData = await gameService.getAllGames();
      setAllGames(gamesData);

      // Применяем текущие фильтры
      applyFilters(gamesData, searchQuery, selectedGenre);
    } catch (error) {
      setError('Ошибка загрузки игр.');
      setAllGames([]);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = (gamesData, query = searchQuery, genre = selectedGenre) => {
    let filteredGames = [...gamesData];

    // Фильтрация по жанру
    if (genre) {
      filteredGames = filteredGames.filter(game =>
        game.genres?.includes(genre) || game.genre === genre
      );
    }

    // Фильтрация по поисковому запросу
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredGames = filteredGames.filter(game =>
        game.title.toLowerCase().includes(lowerQuery) ||
        (game.description && game.description.toLowerCase().includes(lowerQuery))
      );
    }

    setGames(filteredGames);
  };

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const genreFromUrl = searchParams.get('genre');

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
    if (genreFromUrl) {
      setSelectedGenre(genreFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }

    // Применяем фильтры ко всем загруженным играм
    applyFilters(allGames);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);

    if (genre) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('genre', genre);
      if (searchQuery.trim()) {
        newParams.set('search', searchQuery);
      }
      setSearchParams(newParams);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('genre');
      if (searchQuery.trim()) {
        newParams.set('search', searchQuery);
      }
      setSearchParams(newParams);
    }

    // Применяем фильтры ко всем загруженным играм
    applyFilters(allGames, searchQuery, genre);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSearchParams({});
    setGames(allGames);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center padding-y-4">
          <div className="loading">
            <h3>Загрузка игр...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="card max-w-500 mx-auto my-2">
            <h3>Ошибка</h3>
            <p>{error}</p>
            <button onClick={loadGames} className="btn mt-2">
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>Каталог игр</h1>
      </div>

      <div className="card mb-4 padding-2">
        <form onSubmit={handleSearchSubmit} className="search-filters">
          <div className="search-section mb-3">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Поиск игр по названию..."
                value={searchQuery}
                onChange={handleInputChange}
                className="search-input"
              />
              <button type="submit" className="btn search-submit-btn">
                Найти
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h4>Фильтр по жанрам:</h4>
            <div className="genre-buttons">
              {genres.map(genre => (
                <button
                  key={genre.value}
                  type="button"
                  className={`genre-btn ${selectedGenre === genre.value ? 'active' : ''}`}
                  onClick={() => handleGenreChange(genre.value)}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          </div>

          <div className="actions-section mt-3">
            <button type="button" onClick={handleReset} className="btn btn-secondary">
              Сбросить фильтры
            </button>
          </div>
        </form>
      </div>

      {(searchQuery || selectedGenre) && (
        <div className="card mb-4">
          <div className="results-info">
            <p>
              Найдено игр: <strong>{games.length}</strong>
              {searchQuery && ` по запросу "${searchQuery}"`}
              {selectedGenre && ` в жанре "${genres.find(g => g.value === selectedGenre)?.label}"`}
            </p>
          </div>
        </div>
      )}

      {games.length > 0 ? (
        <div className="games-grid">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <div className="card max-w-400 mx-auto my-2 padding-2">
            <h3>Игры не найдены</h3>
            {(searchQuery || selectedGenre) && (
              <button onClick={handleReset} className="btn">
                Показать все игры
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameList;