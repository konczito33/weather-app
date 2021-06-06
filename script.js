const WEATHER_KEY = `5937e48258dc7856eaf3f4e49ed820a0`
const WEATHER_LINK = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
const IP_LINK = `https://geo.ipify.org/api/v1?apiKey=at_VpzZNnIRzyipiqrtXhduYR25T6LQL`
const GOOGLE_KEY = `AIzaSyCHoPD7FvLTNK_nMNEyOMYIhsHpkSzYl7E`

//HTML ELEMENTS
const cityEl = document.querySelector('.main__city')
tempEl = document.querySelector('.main__temperature')
feelsLikeEl = document.querySelector('.main__feels-like')
descEl = document.querySelector('.main__desc')
mainPhotoEl = document.querySelector('.main__image')
pressureEl = document.querySelector('.pressure-value')
humidityEl = document.querySelector('.water-value')
windSpeedEl = document.querySelector('.wind-value')
sunriseEl = document.querySelector('.sun-hour')
sunsetEl = document.querySelector('.moon-hour')
slider = document.querySelector('.slider')
dailyForecastContainer = document.querySelector('.forecast')
inputSearch = document.querySelector('#search')

async function getData(URL) {
  try {
    const fetchData = await fetch(URL)
    const data = await fetchData.json()
    return data

  } catch (err) {
    console.log(err)
  }
}

getData('https://api.openweathermap.org/data/2.5/weather?q=Zdunska Wola&lang=eng&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0') //aktualna
getData('https://api.openweathermap.org/data/2.5/onecall?lat=51.5992&lon=18.9397&exclude=minutely,alerts&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0') //daily i 48hr

async function updateData(data) {
  const resData = await data
  const {
    current
  } = resData
  const {
    feels_like,
    wind_speed: windSpeed,
    sunrise,
    sunset,
    temp,
    weather,
    humidity,
    pressure
  } = current
  const {
    icon: photoId,
    main
  } = weather[0]

  tempEl.textContent = `${temp.toFixed()}°`
  feelsLikeEl.textContent = `Feels like ${feels_like.toFixed()}°`
  mainPhotoEl.src = `http://openweathermap.org/img/wn/${photoId}@2x.png`
  descEl.textContent = `${main}`
  pressureEl.textContent = `${pressure}hPa`
  humidityEl.textContent = `${humidity}%`
  windSpeedEl.textContent = `${windSpeed}km/h`
  sunriseEl.textContent = `${sToTime(sunrise)}`
  sunsetEl.textContent = `${sToTime(sunset)}`

  const {
    hourly
  } = resData


  hourly.forEach(hour => {
    displayHourlyForecast(hour)
  })

  const {
    daily
  } = resData
  const dailyShort = daily.slice(0, 3)

  dailyShort.forEach(day => {
    const {
      dt,
      temp
    } = day

    const {
      icon
    } = day.weather[0]
    const {
      day: dayTemp,
      night: nightTemp
    } = temp

    const dayEl = document.createElement('div')
    dayEl.classList.add('forecast__container')
    dayEl.innerHTML = `  
            <h3 class="forecast__day">${getDay(dt)}</h3>
            <img class="forecast__icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"></img>
            <h3 class="forecast__temperature forecast__temperature--day">${dayTemp.toFixed()}°</h3>
            <h3 class="forecast__temperature forecast__temperature--night">${nightTemp.toFixed()}°</h3>`

    dailyForecastContainer.appendChild(dayEl)
  })

}

updateData(getData('https://api.openweathermap.org/data/2.5/onecall?lat=51.5992&lon=18.9397&exclude=minutely,alerts&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0'))




function sToTime(s) {
  const date = new Date(s * 1000)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${timeFormat(hours)}:${timeFormat(minutes)}`
}

function getDay(s) {
  const dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const date = new Date(s * 1000)
  const day = date.getDay()
  return dayArr[day]
}

function timeFormat(time) {
  if (time < 10) {
    return time = `0${time}`
  } else {
    return `${time}`
  }
}

function displayHourlyForecast(hour) {
  const {
    dt,
    temp
  } = hour
  const {
    icon
  } = hour.weather[0]

  const slideEl = document.createElement('div')
  slideEl.classList.add('slide')
  slideEl.innerHTML = `
            <h4 class="slide__hour">${sToTime(dt)}</h4>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" class="slide__icon"></img>
            <h4 class="slide__temperature">${temp.toFixed()}°</h4>`
  slider.appendChild(slideEl)
}


function displayDailyForecast(day) {

}






//GOOGLE

// function activateGoogleApi() {
//   const autocomplete = new google.maps.places.Autocomplete(inputSearch, {})
//   autocomplete.addListener('place_changed', () => {
//     onPlaceChanged(autocomplete)
//   })
// }

// function onPlaceChanged(autocomplete) {
//   const place = autocomplete.getPlace()
//   inputSearch.value = place.name
// }







//MAP 

// async function createMap(URL) {
//   const data = await getData(URL)
//   const {
//     location
//   } = data
//   const {
//     lat,
//     lng
//   } = location
//   map = L.map('map').setView([lat, lng], 1);
//   L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=5YGqAQzCA1gKabtUXy20', {
//     tileSize: 512,
//     zoomOffset: -1,
//     minZoom: 10,
//     attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
//     crossOrigin: true
//   }).addTo(map);

//   const marker = L.marker([lat, lng]).addTo(map)
// }

// createMap('https://geo.ipify.org/api/v1?apiKey=at_VpzZNnIRzyipiqrtXhduYR25T6LQL')