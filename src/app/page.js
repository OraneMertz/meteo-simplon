'use client';

import './style.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faSpinner,
  faWind
} from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from 'react';
import conf from './conf.json';
import callApi from './api';
import { getWeatherImage } from './display';

export default function Home() {
  const [cityWeather, setCityWeather] = useState(undefined);
  const [imageWeather, setImageWeather] = useState("");  


  useEffect(() => {
    callApi(setCityWeather);
    const interval = setInterval(() => {
      callApi(setCityWeather);
    }, conf.refresh);
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(cityWeather?.weather?.length > 0){
      setImageWeather(getWeatherImage(cityWeather?.weather[0]?.main));
    }
  }, [cityWeather?.weather]);

  return (
    <body>
      <div className="card">
        {!cityWeather &&
          <div className="weather">
            <FontAwesomeIcon icon={faSpinner} spin className="loader" />
          </div>
        }
        {cityWeather &&
          <div className="weather">
            <img src={imageWeather} className="weather-icon" />
            <h1 className="temp">{Math.round(cityWeather?.main?.temp)}°C</h1>
            <h2 className="city">{cityWeather?.name}</h2>
            <div className ="details">
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
                  <p className="wind">{cityWeather?.wind?.speed} km/h</p>
                  <p>Vitesse du vent</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </body>
  )
}
