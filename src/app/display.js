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

    case "Atmosphere":
      weatherImage = "/fumee.png";
      break;

    case "Clear":
      weatherImage = "/sun.png";
      break;

    default:
      weatherImage = "/sun.png";
      break;
  }

  return weatherImage;
}

// Dégradé dynamique selon le type de météo
export function getWeatherGradient(weather){
  switch(weather) {
    case "Clear":
      return "linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)"; // Orange/Rouge - Ensoleillé
    case "Clouds":
      return "linear-gradient(135deg, #A8DADC 0%, #457B9D 100%)"; // Gris/Bleu - Nuageux
    case "Rain":
      return "linear-gradient(135deg, #4A5899 0%, #1E3A5F 100%)"; // Bleu foncé - Pluie
    case "Drizzle":
      return "linear-gradient(135deg, #6B8CAE 0%, #2D5A7B 100%)"; // Bleu gris - Bruine
    case "Thunderstorm":
      return "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)"; // Noir/Bleu très foncé - Orage
    case "Snow":
      return "linear-gradient(135deg, #E0E7FF 0%, #B4C7E7 100%)"; // Blanc/Bleu pâle - Neige
    case "Atmosphere":
      return "linear-gradient(135deg, #8B7D6B 0%, #5A4A3A 100%)"; // Beige/Marron - Brume
    default:
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"; // Violet par défaut
  }
}