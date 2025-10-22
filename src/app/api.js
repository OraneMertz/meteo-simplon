import conf from './conf.json';

export default function callApi(setCityWeather){
    fetch(`${conf.baseApiUrl}?q=${conf.city}&units=metric&lang=fr&appid=${conf.apiKey}`)
        .then((response) => response.json()
        .then((data) => {
            setCityWeather(data);
            console.log(data);
        })
        .catch((error) => console.log(error))
    )
}