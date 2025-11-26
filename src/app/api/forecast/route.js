export async function GET(request) {
    const city = request.nextUrl.searchParams.get('city');

    if (!city || typeof city !== 'string' || city.length > 100) {
        return Response.json(
            { error: 'Ville invalide' },
            { status: 400 }
        );
    }

    try {
        if (!process.env.WEATHER_API_KEY) {
            return Response.json(
                { error: 'Configuration serveur incomplète' },
                { status: 500 }
            );
        }

        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.WEATHER_API_KEY}`
        );

        if (!geoResponse.ok) {
            throw new Error('Erreur géocodage');
        }

        const geoData = await geoResponse.json();
        if (!geoData || geoData.length === 0) {
            return Response.json(
                { error: 'Ville non trouvée' },
                { status: 404 }
            );
        }

        const { lat, lon, name, country } = geoData[0];

        // Étape 2: Récupérer prévisions via Open-Meteo (gratuit, pas de clé nécessaire)
        const forecastResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto&language=fr`
        );

        if (!forecastResponse.ok) {
            throw new Error('Erreur prévisions');
        }

        const forecastData = await forecastResponse.json();

        // Transformer les données au format attendu
        const transformedData = {
            city: name,
            country: country,
            lat,
            lon,
            daily: forecastData.daily.time.map((date, index) => ({
                dt: new Date(date).getTime() / 1000,
                temp: {
                    max: forecastData.daily.temperature_2m_max[index],
                    min: forecastData.daily.temperature_2m_min[index],
                },
                weather: [
                    {
                        main: getWeatherDescription(forecastData.daily.weather_code[index]),
                        description: getWeatherDescription(forecastData.daily.weather_code[index]),
                    }
                ],
                precipitation: forecastData.daily.precipitation_sum[index],
            }))
        };

        return Response.json(transformedData);
    } catch (error) {
        console.error('Erreur API forecast:', error);
        return Response.json(
            { error: error.message || 'Impossible de récupérer la prévision' },
            { status: 500 }
        );
    }
}

// Convertir les codes météo WMO en descriptions
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear',
        1: 'Clouds',
        2: 'Clouds',
        3: 'Clouds',
        45: 'Mist',
        48: 'Mist',
        51: 'Drizzle',
        53: 'Drizzle',
        55: 'Drizzle',
        61: 'Rain',
        63: 'Rain',
        65: 'Rain',
        71: 'Snow',
        73: 'Snow',
        75: 'Snow',
        77: 'Snow',
        80: 'Rain',
        81: 'Rain',
        82: 'Rain',
        85: 'Snow',
        86: 'Snow',
        95: 'Thunderstorm',
        96: 'Thunderstorm',
        99: 'Thunderstorm',
    };
    return weatherCodes[code] || 'Clear';
}