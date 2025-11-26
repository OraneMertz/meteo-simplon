'use client';

import styles from './ForecastCard.module.css';
import {getWeatherImage} from "../display";
import {formatTemperature} from "../utils/weatherMapper";

export default function ForecastCard({ forecastData }) {
    if (!forecastData?.daily || forecastData.daily.length === 0) {
        return null;
    }

    const forecasts = forecastData.daily.slice(0, 5);

    if (forecasts.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Prévisions 5 jours</h3>
            <div className={styles.grid}>
                {forecasts.map((forecast, index) => {
                    const date = new Date(forecast.dt * 1000);
                    const dayName = date.toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric'
                    });

                    return (
                        <div key={index} className={styles.card}>
                            <p className={styles.date}>{dayName}</p>
                            <img
                                src={getWeatherImage(forecast.weather[0].main)}
                                alt={forecast.weather[0].description}
                                className={styles.icon}
                            />
                            <div className={styles.temps}>
                                <span className={styles.max}>
                                  {formatTemperature(forecast.temp.max)}°
                                </span>
                                <span className={styles.min}>
                                  {formatTemperature(forecast.temp.min)}°
                                </span>
                            </div>
                            <p className={styles.description}>{forecast.weather[0].main}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}