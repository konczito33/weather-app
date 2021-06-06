const WEATHER_KEY = `5937e48258dc7856eaf3f4e49ed820a0`
const WEATHER_LINK = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
const IP_LINK = `https://geo.ipify.org/api/v1?apiKey=at_VpzZNnIRzyipiqrtXhduYR25T6LQL`
const GOOGLE_KEY = `AIzaSyCHoPD7FvLTNK_nMNEyOMYIhsHpkSzYl7E`

let lat
let lon
let searchInputValue

const inputSearch = document.querySelector('#search')

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
getData('https://api.openweathermap.org/data/2.5/onecall?lat=51.5992&lon=18.9397&exclude=current,minutely,alerts&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0') //daily i 48hr

// async function displayForecast(data){
//     const forecast = await data
//     const {list} = forecast
//     const listShort = list.slice(0,5)
//     console.log(forecast)
//     listShort.forEach(list => {
//       console.log(list.weather[0])
//     })
// }

// displayForecast(getData('http://api.openweathermap.org/data/2.5/forecast?q=Zdunska Wola&appid=5937e48258dc7856eaf3f4e49ed820a0'))


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