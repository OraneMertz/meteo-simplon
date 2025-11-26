export async function GET(request) {
    const query = request.nextUrl.searchParams.get('q');

    if (!query || typeof query !== 'string' || query.length < 2 || query.length > 100) {
        return Response.json(
            { error: 'Requête invalide' },
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

        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${process.env.WEATHER_API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Erreur géocodage');
        }

        const data = await response.json();

        const suggestions = data.map((city) => ({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
            state: city.state,
        }));

        return Response.json({ suggestions });
    } catch (error) {
        console.error('Erreur API geocode:', error);
        return Response.json(
            { error: 'Erreur lors de la recherche' },
            { status: 500 }
        );
    }
}