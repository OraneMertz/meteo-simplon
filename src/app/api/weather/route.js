export async function GET(request) {
    const city = request.nextUrl.searchParams.get('city');

    // Validation
    if (!city || typeof city !== 'string' || city.length > 100) {
        return Response.json(
            { error: 'Ville invalide' },
            { status: 400 }
        );
    }

    try {
        if (!process.env.WEATHER_API_BASE_URL || !process.env.WEATHER_API_KEY) {
            console.error('Variables d\'environnement manquantes:', {
                hasBaseUrl: !!process.env.WEATHER_API_BASE_URL,
                hasApiKey: !!process.env.WEATHER_API_KEY,
            });
            return Response.json(
                { error: 'Configuration serveur incomplète' },
                { status: 500 }
            );
        }

        const url = `${process.env.WEATHER_API_BASE_URL}?q=${encodeURIComponent(city)}&units=metric&lang=fr&appid=${process.env.WEATHER_API_KEY}`;

        console.log('Appel API météo pour:', city);

        const response = await fetch(url);

        if (!response.ok) {
            console.error('Erreur OpenWeatherMap:', response.status);
            if (response.status === 404) {
                return Response.json(
                    { error: 'Ville non trouvée' },
                    { status: 404 }
                );
            }
            throw new Error(`API OpenWeatherMap: ${response.status}`);
        }

        const data = await response.json();

        if (!data.main || !data.weather) {
            throw new Error('Données invalides');
        }

        return Response.json(data);
    } catch (error) {
        console.error('Erreur API météo:', error);
        return Response.json(
            { error: error.message || 'Impossible de récupérer les données météo' },
            { status: 500 }
        );
    }
}