import { useState, useEffect } from 'react';

export function useForecast(city) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!city) {
            setData(null);
            return;
        }

        let isMounted = true;

        const fetchForecast = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/forecast?city=${encodeURIComponent(city)}`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erreur lors de la récupération');
                }

                const forecastData = await response.json();

                if (isMounted) {
                    setData(forecastData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    console.error('Erreur forecast:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchForecast();

        return () => {
            isMounted = false;
        };
    }, [city]);

    return { data, loading, error };
}