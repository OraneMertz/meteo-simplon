export function getWeatherImage(weather){
    let weatherImage = ""
  
    switch (weather) {
      case "Clouds":
        weatherImage = "/clouds.png";
        break;
    
      case "Rain":
        weatherImage = "/rain.png";
        break;
  
      case "Drizzle":
        weatherImage = "/bruine.png";
        break;
  
      case "Thunderstorm":
        weatherImage = "/orage.png";
        break;  
  
      case "Snow":
        weatherImage = "/neige.png";
        break;
      
      case "Atsmosphere":
        weatherImage = "/fumee.png";
        break;
  
      default:
        weatherImage = "/sun.png";
        break;
    }
  
    return weatherImage;
  }