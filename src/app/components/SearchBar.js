'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, isLoading }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Rechercher une ville..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.input}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className={styles.button}
                    disabled={isLoading}
                    aria-label="Rechercher"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </form>
    );
}