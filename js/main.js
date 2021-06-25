//HTML ELEMENTS


import * as Time from './time.js'
import * as Storage from './localstorage.js'

import {
    updateCoords,
    getCoordsData
} from './coords.js'
import {
    getData,
    displayActualData
} from './getdata.js'
import * as Slider from './slider.js'


const tempEl = document.querySelector('.main__temperature')
const feelsLikeEl = document.querySelector('.main__feels-like')
const descEl = document.querySelector('.main__desc')
const mainPhotoEl = document.querySelector('.main__image')
const pressureEl = document.querySelector('.pressure-value')
const humidityEl = document.querySelector('.water-value')
const windSpeedEl = document.querySelector('.wind-value')
const sunriseEl = document.querySelector('.sun-hour')
export const slider = document.querySelector('.slider')
const dailyForecastContainer = document.querySelector('.forecast')
const containerEl = document.querySelector('.container')
const separators = document.querySelectorAll('.separator')
const errorEl = document.querySelector('.error')












window.addEventListener('load', () => {
    let long
    let lat

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude
            lat = position.coords.latitude
            updateForecastData(getData(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=current,minutely,alerts&appid=5937e48258dc7856eaf3f4e49ed820a0`))
            displayActualData(getData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`))
            Map.createMap(long, lat)

        }, () => {
            displayError()
            errorEl.innerText = 'Enable localization'
        })
    }
})

const form = document.querySelector('form')
const inputSearch = document.querySelector('#search')
let city
form.addEventListener('submit', async function (e) {
    e.preventDefault()
    slider.style.transform = `translate(0)`
    inputSearch.value = ''
    hideError()
    clearForecast()
    let long
    let lat
    const location = await updateCoords(getCoordsData(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCUjKqI_6yohkGHjURltQi4OrXz3mRhoDc`))
    if (!location) displayError()
    long = location.lng
    lat = location.lat
    updateForecastData(getData(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=current,minutely,alerts&appid=5937e48258dc7856eaf3f4e49ed820a0`))
    displayActualData(getData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`))
    separators.forEach(separator => separator.style.display = 'block')
    Lib.removeLibrary()
    Lib.enableLibraryButton()

})

inputSearch.addEventListener('input', (e) => {
    city = e.target.value
})

function clearForecast() {
    slider.innerHTML = ``
    dailyForecastContainer.innerHTML = ``
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
            <h4 class="slide__hour">${Time.sToTime(dt)}</h4>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" class="slide__icon"></img>
            <h4 class="slide__temperature">${temp.toFixed()}°</h4>`
    slider.appendChild(slideEl)
    slideEl.addEventListener('touchstart', Slider.touchStart(index))
    slideEl.addEventListener('touchend', Slider.touchEnd)
    slideEl.addEventListener('touchmove', Slider.touchMove)
}


async function updateForecastData(data) {
    const resData = await data
    const {
        hourly
    } = resData
    hourly.slice(0, 24).forEach((hour, index) => {
        displayHourlyForecast(hour, index)
    })

    const {
        daily
    } = resData
    const dailyShort = daily.slice(1, 7)

    dailyShort.forEach(day => {
        displayDailyForecast(day)
    })

}

function displayError() {
    errorEl.classList.add('active')
    mainEl.innerHTML = ``
    detailsEl.innerHTML = ``
    sunsetSectionEl.innerHTML = ``
    separators.forEach(separator => separator.style.display = 'none')
}

function hideError() {
    errorEl.classList.remove('active')
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
            <h3 class="forecast__day">${Time.getDay(dt)}</h3>
            <img class="forecast__icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"></img>
            <h3 class="forecast__temperature forecast__temperature--day">${dayTemp.toFixed()}°</h3>
            <h3 class="forecast__temperature forecast__temperature--night">${nightTemp.toFixed()}°</h3>`

    dailyForecastContainer.appendChild(dayEl)
}






window.addEventListener('DOMContentLoaded', Storage.displayCitiesFromStorage)



//ADDING TO LIBRARY

import * as Lib from './library.js'
import { addedCities } from './library.js'

Lib.libraryButton.addEventListener('click', () => {
    const libraryBackButton = document.querySelector('.library__button')
    document.querySelector('body').style.height = '100vh'
    libraryBackButton.addEventListener('click', () => {
        Lib.removeLibrary()
        Lib.enableLibraryButton()
    })
    Lib.addedCities.forEach(city => {
        Lib.displayLibraryCities(city)
    })
    Lib.activeLibrary()
    Nav.closeNav()
    Lib.disableLibraryButton()
})

//NAVIGATION

import * as Nav from './sidenav.js'

Nav.hamburgerButton.addEventListener('click', Nav.openNav)
Nav.closeNavBtn.addEventListener('click', Nav.closeNav)


//clock

function updateClock() {
    const hourEl = document.querySelector('.side-nav__hour')
    const dateEl = document.querySelector('.side-nav__date')
    const date = new Date
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const year = date.getFullYear()
    const day = date.getDate()
    const month = date.getMonth()
    dateEl.innerText = `${day}.${fixDate(month)}.${year}`
    hourEl.innerText = `${hour}:${fixDate(minutes)}`
    window.setTimeout(updateClock, 1000)
}

function fixDate(date) {
    if (date <= 9) {
        return `0${date}`
    } else {
        return date
    }
}

window.setTimeout(updateClock, 1000)

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


import * as Map from './map.js'


window.addEventListener('click', Map.hideMap)