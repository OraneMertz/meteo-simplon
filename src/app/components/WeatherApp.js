'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import ForecastCard from './ForecastCard';
import styles from './WeatherApp.module.css';
import {useForecast} from "../hooks/useForecast";

export default function WeatherApp({ defaultCity }) {
    const [city, setCity] = useState(defaultCity);
    const { data: forecastData, loading: forecastLoading, error: forecastError } = useForecast(city);

    const handleSearch = (searchCity) => {
        setCity(searchCity);
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Météo en Direct</h1>

                <SearchBar onSearch={handleSearch} isLoading={forecastLoading} />

                <WeatherCard city={city} refreshInterval={3600000} />

                {forecastData && !forecastError && (
                    <ForecastCard forecastData={forecastData} />
                )}
            </div>
        </main>
    );
}