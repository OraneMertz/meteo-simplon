const WEATHER_ICONS = {
    Clouds: '/clouds.png',
    Rain: '/rain.png',
    Drizzle: '/bruine.png',
    Thunderstorm: '/orage.png',
    Snow: '/neige.png',
    Atmosphere: '/fumee.png',
    Clear: '/sun.png',
    Mist: '/fumee.png',
};

export function getWeatherImage(weatherMain) {
    if (typeof weatherMain !== 'string') return WEATHER_ICONS.Clear;

    return WEATHER_ICONS[weatherMain] || WEATHER_ICONS.Clear;
}

export function formatTemperature(temp) {
    if (typeof temp !== 'number') return '--';
    return Math.round(temp);
}

export function formatWindSpeed(speed) {
    if (typeof speed !== 'number') return '--';
    return Math.round(speed * 10) / 10;
}

export function formatHumidity(humidity) {
    if (typeof humidity !== 'number') return '--';
    return humidity;
}