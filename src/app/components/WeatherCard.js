import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faWind } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import styles from './WeatherCard.module.css';
import { useWeather } from "../hooks/useWeather";
import {getWeatherImage} from "../display";
import {formatHumidity, formatTemperature, formatWindSpeed} from "../utils/weatherMapper";

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

    return (
        <div className={styles.card}>
            <div className={styles.weather}>
                <img
                    src={imageUrl}
                    alt={weather.weather[0].description}
                    className={styles.icon}
                />
                <h1 className={styles.temperature}>{temperature}°C</h1>
                <h2 className={styles.city}>{weather.name}</h2>
                <p className={styles.description}>{weather.weather[0].description}</p>

                <div className={styles.details}>
                    <div className={styles.detail}>
                        <FontAwesomeIcon icon={faDroplet} className={styles.detailIcon} />
                        <div>
                            <p className={styles.value}>{humidity}%</p>
                            <p className={styles.label}>Humidité</p>
                        </div>
                    </div>

                    <div className={styles.detail}>
                        <FontAwesomeIcon icon={faWind} className={styles.detailIcon} />
                        <div>
                            <p className={styles.value}>{windSpeed} km/h</p>
                            <p className={styles.label}>Vitesse du vent</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}