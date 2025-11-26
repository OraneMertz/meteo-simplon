export const weatherTranslations = {
    Clear: 'Dégagé',
    Clouds: 'Nuageux',
    Rain: 'Pluie',
    Drizzle: 'Bruine',
    Thunderstorm: 'Orage',
    Snow: 'Neige',
    Mist: 'Brume',
    Smoke: 'Fumée',
    Haze: 'Brume',
    Dust: 'Poussière',
    Fog: 'Brouillard',
    Sand: 'Sable',
    Ash: 'Cendres',
    Squall: 'Rafales',
    Tornado: 'Tornade',
};

export function translateWeather(weatherMain) {
    return weatherTranslations[weatherMain] || weatherMain;
}

// Pour Open-Meteo codes
export const wmoCodeTranslations = {
    0: 'Dégagé',
    1: 'Peu nuageux',
    2: 'Partiellement nuageux',
    3: 'Nuageux',
    45: 'Brume',
    48: 'Brume',
    51: 'Bruine légère',
    53: 'Bruine',
    55: 'Bruine intense',
    61: 'Pluie légère',
    63: 'Pluie',
    65: 'Pluie intense',
    71: 'Neige légère',
    73: 'Neige',
    75: 'Neige intense',
    77: 'Grains de neige',
    80: 'Averses légères',
    81: 'Averses',
    82: 'Averses intenses',
    85: 'Averses de neige légères',
    86: 'Averses de neige',
    95: 'Orage',
    96: 'Orage avec grêle',
    99: 'Orage intense',
};

export function translateWmoCode(code) {
    return wmoCodeTranslations[code] || 'Inconnu';
}