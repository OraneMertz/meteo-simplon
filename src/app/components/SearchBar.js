'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, isLoading }) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Récupérer les suggestions de villes
        try {
            const response = await fetch(
                `/api/geocode?q=${encodeURIComponent(value)}`
            );
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.suggestions || []);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Erreur recherche:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (city) => {
        setInput(city.name);
        onSearch(city.name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleClear = () => {
        setInput('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.searchContainer}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="Rechercher une ville..."
                        value={input}
                        onChange={handleInputChange}
                        onFocus={() => input && suggestions.length > 0 && setShowSuggestions(true)}
                        className={styles.input}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    {input && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={styles.clearButton}
                            disabled={isLoading}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className={styles.button}
                    disabled={isLoading}
                    aria-label="Rechercher"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                    {suggestions.map((city, index) => (
                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => handleSuggestionClick(city)}
                                className={styles.suggestionItem}
                            >
                                <span className={styles.cityName}>{city.name}</span>
                                {city.country && (
                                    <span className={styles.country}>{city.country}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
}