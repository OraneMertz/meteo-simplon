import { useState, useEffect } from 'react';

export function useWeather(city, refreshInterval) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let intervalId = null;

        const fetchWeather = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/weather?city=${encodeURIComponent(city)}`
                );

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération');
                }

                const weatherData = await response.json();

                if (isMounted) {
                    setData(weatherData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    console.error('Erreur météo:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchWeather();

        intervalId = setInterval(fetchWeather, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [city, refreshInterval]);

    return { data, loading, error };
}