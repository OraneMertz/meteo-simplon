import conf from './conf.json';

// Appel API pour météo actuelle
export function callApi(setCityWeather, city = conf.city){
    fetch(`${conf.baseApiUrl}?q=${city}&units=metric&lang=fr&appid=${conf.apiKey}`)
        .then((response) => {
            if (!response.ok) throw new Error('Ville non trouvée');
            return response.json();
        })
        .then((data) => {
            setCityWeather(data);
            console.log('Météo actuelle:', data);
        })
        .catch((error) => {
            console.log('Erreur API:', error);
            alert('Erreur : Ville non trouvée');
        })
}

// Appel API pour les prévisions 5 jours
export function callForecastApi(setForecast, city = conf.city){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${conf.apiKey}`)
        .then((response) => {
            if (!response.ok) throw new Error('Prévisions non disponibles');
            return response.json();
        })
        .then((data) => {
            // Filtrer pour avoir 1 prévision par jour (à midi)
            const dailyForecasts = [];
            const seenDates = new Set();

            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!seenDates.has(date) && item.dt_txt.includes('12:00:00')) {
                    seenDates.add(date);
                    dailyForecasts.push(item);
                    if (dailyForecasts.length >= 5) return;
                }
            });

            setForecast(dailyForecasts);
            console.log('Prévisions 5 jours:', dailyForecasts);
        })
        .catch((error) => console.log('Erreur prévisions:', error))
}

// Autocomplete : Récupérer les suggestions de villes
export async function getCitySuggestions(query) {
    if (query.length < 2) return [];

    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${conf.apiKey}`
        );
        if (!response.ok) return [];

        const data = await response.json();
        return data.map(item => ({
            name: item.name,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
            fullName: `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`
        }));
    } catch (error) {
        console.log('Erreur autocomplete:', error);
        return [];
    }
}

// Géolocalisation
export function getLocationWeather(setCityWeather, setForecast) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${conf.apiKey}`
                )
                    .then(response => response.json())
                    .then(data => {
                        setCityWeather(data);
                        callForecastApi(setForecast, data.name);
                    })
                    .catch(error => console.log('Erreur géolocalisation:', error));
            },
            (error) => console.log('Géolocalisation refusée:', error)
        );
    }
}