
//HTML ELEMENTS
const cityEl = document.querySelector('.main__city')
const tempEl = document.querySelector('.main__temperature')
const feelsLikeEl = document.querySelector('.main__feels-like')
const descEl = document.querySelector('.main__desc')
const mainPhotoEl = document.querySelector('.main__image')
const pressureEl = document.querySelector('.pressure-value')
const humidityEl = document.querySelector('.water-value')
const windSpeedEl = document.querySelector('.wind-value')
const sunriseEl = document.querySelector('.sun-hour')
const sunsetEl = document.querySelector('.moon-hour')
const slider = document.querySelector('.slider')
const dailyForecastContainer = document.querySelector('.forecast')
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

window.addEventListener('load',  () => {
  let long
  let lat

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude
      lat = position.coords.latitude
      updateData(getData(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`))
      displayCityName(getData(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCUjKqI_6yohkGHjURltQi4OrXz3mRhoDc`))
    }, () => {
      document.querySelector('body').innerHTML = 'Enable localisation'
    })
  }
})




//TIME FUNCS
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


//MAIN DISPLAY FUNCS
async function displayCityName(data){
  const resData = await data
  const city = resData.results[1].address_components[2].long_name
  cityEl.textContent = city
}



function displayHourlyForecast(hour, index) {
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
  slideEl.addEventListener('touchstart', touchStart(index))
  slideEl.addEventListener('touchend', touchEnd)
  slideEl.addEventListener('touchmove', touchMove)
}


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


  hourly.slice(0,24).forEach((hour, index) => {
    displayHourlyForecast(hour, index)
  })

  const {
    daily
  } = resData
  const dailyShort = daily.slice(1, 4)

  dailyShort.forEach(day => {
    displayDailyForecast(day)
  })

}



function displayDailyForecast(day) {
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
}

//


//TOUCH SLIDER
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0



function touchStart(idx) {
  return (e) => {
    currentIndex = idx
    startPos = getPostion(e)
    isDragging = true
    animationID = requestAnimationFrame(animation)
    slider.classList.add('grabbing')
  }
}

function touchMove(e) {
  if (isDragging) {
    const currentPostion = getPostion(e)
    currentTranslate = prevTranslate + currentPostion - startPos
  }
}

function touchEnd() {
  isDragging = false
  cancelAnimationFrame(animationID)
  slider.classList.remove('grabbing')
  setPosByIndex()
}

function setPosByIndex() {
  prevTranslate = currentTranslate
  setSliderPostion()
}

function getPostion(e) {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
}

function setSliderPostion() {
  if(currentTranslate < 0 && currentTranslate > -slider.children[0].offsetWidth * slider.children.length + window.innerWidth - 100){
    console.log(currentTranslate)
    slider.style.transform = `translateX(${currentTranslate}px)`
  }
}

function animation() {
  setSliderPostion()
  if (isDragging) {
    requestAnimationFrame(animation)
  }
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