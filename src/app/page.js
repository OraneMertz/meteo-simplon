'use client';

import './style.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faSpinner,
  faWind,
  faMagnifyingGlass,
  faMoon,
  faSun,
  faLocationCrosshairs,
  faEye,
  faGauge,
  faBell,
  faMapLocation
} from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect, useRef } from 'react';
import conf from './conf.json';
import { callApi, callForecastApi, getCitySuggestions, getLocationWeather } from './api';
import { getWeatherImage, getWeatherGradient } from './display';

export default function Home() {
  const [cityWeather, setCityWeather] = useState(undefined);
  const [forecast, setForecast] = useState([]);
  const [imageWeather, setImageWeather] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [gradient, setGradient] = useState("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 46.2276, lng: 2.2137 });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Charger la météo au démarrage
  useEffect(() => {
    callApi(setCityWeather);
    callForecastApi(setForecast);

    const interval = setInterval(() => {
      callApi(setCityWeather);
      callForecastApi(setForecast);
    }, conf.refresh);

    return () => clearInterval(interval);
  }, []);

  // Initialiser Leaflet
  useEffect(() => {
    // Charger Leaflet et ses styles
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Charger CSS Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);

        // Charger JS Leaflet
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
          script.async = true;
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
    };

    loadLeaflet().then(() => {
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        initMap();
      }
    });
  }, []);

  // Mettre à jour la carte quand les coordonnées changent
  useEffect(() => {
    if (mapInstanceRef.current && window.L && cityWeather?.coord) {
      const { lat, lon } = cityWeather.coord;
      mapInstanceRef.current.setView([lat, lon], 11);

      // Supprimer le marqueur précédent s'il existe
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Ajouter nouveau marqueur
      window.L.marker([lat, lon])
          .addTo(mapInstanceRef.current)
          .bindPopup(`📍 ${cityWeather.name}, ${cityWeather.sys?.country}`)
          .openPopup();
    }
  }, [cityWeather?.coord]);

  // Initialiser la carte
  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      const map = window.L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([mapCenter.lat, mapCenter.lng], 11);

      // Ajouter le layer OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('Erreur initialisation map:', error);
    }
  };

  // Mettre à jour l'image et les prévisions
  useEffect(() => {
    if(cityWeather?.weather?.length > 0){
      setImageWeather(getWeatherImage(cityWeather?.weather[0]?.main));
      setGradient(getWeatherGradient(cityWeather?.weather[0]?.main));

      // Actualiser les prévisions
      callForecastApi(setForecast, cityWeather.name);

      // Mettre à jour la position de la carte
      setMapCenter({ lat: cityWeather.coord.lat, lng: cityWeather.coord.lon });

      // Vérifier les conditions extrêmes
      checkExtremeWeather(cityWeather);
    }
  }, [cityWeather?.weather]);

  // Appliquer le thème clair/sombre
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Gestion de l'autocomplete
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchCity(value);

    if (value.length > 1) {
      const results = await getCitySuggestions(value);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  // Recherche
  const handleSearch = (e, city = null) => {
    e.preventDefault();
    const cityToSearch = city || searchCity;
    if(cityToSearch.trim()) {
      callApi(setCityWeather, cityToSearch);
      setSearchCity("");
      setSuggestions([]);
    }
  };

  // Sélection suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchCity(suggestion.fullName);
    callApi(setCityWeather, suggestion.name);
    setSuggestions([]);
  };

  // Géolocalisation
  const handleGeolocation = () => {
    getLocationWeather(setCityWeather, setForecast);
  };

  // Vérifier les conditions météo extrêmes
  const checkExtremeWeather = (weather) => {
    const temp = weather?.main?.temp;
    const windSpeed = weather?.wind?.speed;
    const weatherType = weather?.weather?.[0]?.main;

    let warning = null;

    if (temp < -10) {
      warning = "⚠️ Attention : Froid extrême !";
    } else if (temp > 40) {
      warning = "⚠️ Attention : Chaleur extrême !";
    } else if (windSpeed > 50) {
      warning = "⚠️ Attention : Vents violents !";
    } else if (weatherType === "Thunderstorm") {
      warning = "⚠️ Attention : Orage en cours !";
    }

    if (warning) {
      setNotificationMessage(warning);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  // Générer les styles aléatoires pour les particules
  const getParticleStyle = (index) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 20 + Math.random() * 10;
    const delay = Math.random() * 5;

    return {
      left: `${left}%`,
      top: `${top}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    };
  };

  return (
      <div className={`app ${darkMode ? 'dark' : 'light'}`} style={{ background: gradient }}>
        {/* Particles animation */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={getParticleStyle(i)}></div>
          ))}
        </div>

        {/* Notification */}
        {showNotification && (
            <div className="notification">
              <FontAwesomeIcon icon={faBell} />
              <span>{notificationMessage}</span>
            </div>
        )}

        <div className="card">
          {/* En-tête avec contrôles */}
          <div className="header">
            <h1 className="app-title">🌤️ Météo</h1>
            <div className="controls">
              <button
                  className="btn-icon"
                  onClick={handleGeolocation}
                  title="Votre position"
              >
                <FontAwesomeIcon icon={faLocationCrosshairs} />
              </button>
              <button
                  className="btn-icon theme-toggle"
                  onClick={() => setDarkMode(!darkMode)}
                  title="Thème"
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>
            </div>
          </div>

          {/* Barre de recherche avec autocomplete */}
          <div className="search-container">
            <form className="search" onSubmit={handleSearch}>
              <input
                  type="text"
                  placeholder="Rechercher une ville..."
                  value={searchCity}
                  onChange={handleSearchChange}
                  autoComplete="off"
              />
              <button type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((suggestion, index) => (
                      <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <FontAwesomeIcon icon={faMapLocation} />
                        <span>{suggestion.fullName}</span>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* Météo actuelle */}
          {!cityWeather &&
              <div className="weather">
                <FontAwesomeIcon icon={faSpinner} spin className="loader" />
              </div>
          }

          {cityWeather &&
              <>
                <div className="weather">
                  <img src={imageWeather} className="weather-icon" />
                  <h1 className="temp">{Math.round(cityWeather?.main?.temp)}°C</h1>
                  <h2 className="city">{cityWeather?.name}, {cityWeather?.sys?.country}</h2>
                  <p className="description">{cityWeather?.weather?.[0]?.description}</p>

                  <div className="details">
                    <div className="col">
                      <FontAwesomeIcon icon={faDroplet} />
                      <div>
                        <p className="humidity">{cityWeather?.main?.humidity}%</p>
                        <p>Humidité</p>
                      </div>
                    </div>
                    <div className="col">
                      <FontAwesomeIcon icon={faWind} />
                      <div>
                        <p className="wind">{Math.round(cityWeather?.wind?.speed)} km/h</p>
                        <p>Vent</p>
                      </div>
                    </div>
                    <div className="col">
                      <FontAwesomeIcon icon={faEye} />
                      <div>
                        <p className="visibility">{(cityWeather?.visibility / 1000).toFixed(1)} km</p>
                        <p>Visibilité</p>
                      </div>
                    </div>
                    <div className="col">
                      <FontAwesomeIcon icon={faGauge} />
                      <div>
                        <p className="pressure">{cityWeather?.main?.pressure} hPa</p>
                        <p>Pression</p>
                      </div>
                    </div>
                  </div>

                  {/* Ressenti */}
                  <div className="feels-like">
                    <p>Ressenti : <strong>{Math.round(cityWeather?.main?.feels_like)}°C</strong></p>
                  </div>
                </div>

                {/* Prévisions 5 jours */}
                {forecast.length > 0 && (
                    <div className="forecast-section">
                      <h3>Prévisions 5 jours</h3>
                      <div className="forecast-container">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-card">
                              <p className="forecast-date">
                                {new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </p>
                              <img src={getWeatherImage(day.weather[0].main)} alt={day.weather[0].main} />
                              <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                              <p className="forecast-desc">{day.weather[0].main}</p>
                            </div>
                        ))}
                      </div>
                    </div>
                )}
              </>
          }
        </div>

        {/* Carte interactive */}
        <div ref={mapRef} id="map" className="map-container"></div>
      </div>
  )
}