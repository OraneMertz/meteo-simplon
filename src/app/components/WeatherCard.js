'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDroplet,
    faWind,
    faEye,
    faGauge,
    faFeatherAlt,
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import styles from './WeatherCard.module.css';
import {useWeather} from "../hooks/useWeather";
import {getWeatherImage} from "../display";
import {formatHumidity, formatTemperature, formatWindSpeed} from "../utils/weatherMapper";
import {translateWeather} from "../utils/weatherTranslations";

export default function WeatherCard({ city, refreshInterval }) {
    const { data: weather, loading, error } = useWeather(city, refreshInterval);

    const handleRetry = () => {
        window.location.reload();
    };

    if (loading && !weather) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={handleRetry} />;
    }

    if (!weather?.main || !weather?.weather?.[0]) {
        return <ErrorMessage message="Données météo invalides" />;
    }

    const imageUrl = getWeatherImage(weather.weather[0].main);
    const temperature = formatTemperature(weather.main.temp);
    const windSpeed = formatWindSpeed(weather.wind.speed);
    const humidity = formatHumidity(weather.main.humidity);
    const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const visibility = (weather.visibility / 1000).toFixed(1);
    const pressure = weather.main.pressure;
    const feelsLike = formatTemperature(weather.main.feels_like);
    const windGust = weather.wind.gust ? formatWindSpeed(weather.wind.gust) : '--';

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.mainInfo}>
                    <img
                        src={imageUrl}
                        alt={weather.weather[0].description}
                        className={styles.icon}
                    />
                    <div className={styles.titleSection}>
                        <h1 className={styles.city}>{weather.name}</h1>
                        <p className={styles.description}>{translateWeather(weather.weather[0].main)}</p>
                        <p className={styles.detailDescription}>{weather.weather[0].description}</p>
                    </div>
                </div>
                <div className={styles.temperatureSection}>
                    <div className={styles.temperature}>{temperature}°C</div>
                    <div className={styles.feelsLike}>Ressenti {feelsLike}°C</div>
                </div>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <div className={styles.detailIcon}>
                        <FontAwesomeIcon icon={faDroplet} />
                    </div>
                    <div className={styles.detailContent}>
                        <p className={styles.detailValue}>{humidity}%</p>
                        <p className={styles.detailLabel}>Humidité</p>
                    </div>
                </div>

                <div className={styles.detailItem}>
                    <div className={styles.detailIcon}>
                        <FontAwesomeIcon icon={faWind} />
                    </div>
                    <div className={styles.detailContent}>
                        <p className={styles.detailValue}>{windSpeed} km/h</p>
                        <p className={styles.detailLabel}>Vent</p>
                    </div>
                </div>

                <div className={styles.detailItem}>
                    <div className={styles.detailIcon}>
                        <FontAwesomeIcon icon={faFeatherAlt} />
                    </div>
                    <div className={styles.detailContent}>
                        <p className={styles.detailValue}>{windGust} km/h</p>
                        <p className={styles.detailLabel}>Rafales</p>
                    </div>
                </div>
            </div>
        </div>
    );
}