'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import WeatherApp from './components/WeatherApp';
import './globals.css';

export default function Home() {
    const city = process.env.NEXT_PUBLIC_CITY || 'Niort';

    return <WeatherApp defaultCity={city} />;
}