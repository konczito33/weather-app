//HTML ELEMENTS

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
const addToLibraryButton = document.querySelector('.nav__add')
const containerEl = document.querySelector('.container')
const mainEl = document.querySelector('.main')
const detailsEl = document.querySelector('.section-details')
const sunsetSectionEl = document.querySelector('.sunset')
const separators = document.querySelectorAll('.separator')
const errorEl = document.querySelector('.error')
const mapEl = document.querySelector('.map')

let actualCity

async function getData(URL) {
  try {
    const fetchData = await fetch(URL)
    const data = await fetchData.json()
    return data

  } catch (err) {
    console.log(err)
  }
}

async function getCoordsData(URL) {
  try {
    const fetchData = await fetch(URL)
    const data = await fetchData.json()
    if (!data.results) {
      return
    }
    return data

  } catch (err) {
    console.log(err)
  }
}

window.addEventListener('load', () => {
  let long
  let lat

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude
      lat = position.coords.latitude
      updateForecastData(getData(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=current,minutely,alerts&appid=5937e48258dc7856eaf3f4e49ed820a0`))
      displayActualData(getData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`))
      createMap(long, lat)

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
  slider.innerHTML = ``
  dailyForecastContainer.innerHTML = ``
  let long
  let lat
  const location = await updateCoords(getCoordsData(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCUjKqI_6yohkGHjURltQi4OrXz3mRhoDc`))
  if (!location) displayError()
  long = location.lng
  lat = location.lat
  updateForecastData(getData(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=current,minutely,alerts&appid=5937e48258dc7856eaf3f4e49ed820a0`))
  displayActualData(getData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`))
  separators.forEach(separator => separator.style.display = 'block')


})

inputSearch.addEventListener('input', (e) => {
  city = e.target.value
})

async function updateCoords(data) {
  const resData = await data
  if (resData.results.length == 0) return
  const {
    results
  } = resData
  const {
    geometry
  } = results[0]
  const {
    location
  } = geometry
  const {
    lat,
    lng: long
  } = location
  return location
}


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

//


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
  const dailyShort = daily.slice(1, 4)

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
            <h3 class="forecast__day">${getDay(dt)}</h3>
            <img class="forecast__icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"></img>
            <h3 class="forecast__temperature forecast__temperature--day">${dayTemp.toFixed()}°</h3>
            <h3 class="forecast__temperature forecast__temperature--night">${nightTemp.toFixed()}°</h3>`

  dailyForecastContainer.appendChild(dayEl)
}



//


async function displayActualData(data) {
  const resData = await data
  const {
    feels_like,
    temp,
    pressure,
    humidity
  } = resData.main
  const {
    sunrise,
    sunset,
  } = resData.sys
  const {
    speed: windSpeed
  } = resData.wind
  const {
    icon: photoId,
    main
  } = resData.weather[0]

  actualCity = resData.name

  mainEl.innerHTML = `
   <div class="main__info">
            <div class="main__city-c">
                <h2 class="main__city">${resData.name}</h2>
                <svg class="main__city-icon" width="7" height="9" viewBox="0 0 7 9" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.5 5.40005C4.46511 5.40005 5.24998 4.59274 5.24998 3.60003C5.24998 2.60732 4.46511 1.80002 3.5 1.80002C2.53488 1.80002 1.75002 2.60732 1.75002 3.60003C1.75002 4.59274 2.53488 5.40005 3.5 5.40005ZM3.5 2.70003C3.98255 2.70003 4.37499 3.10368 4.37499 3.60003C4.37499 4.09639 3.98255 4.50004 3.5 4.50004C3.01744 4.50004 2.62501 4.09639 2.62501 3.60003C2.62501 3.10368 3.01744 2.70003 3.5 2.70003Z"
                        fill="black" />
                    <path
                        d="M3.24625 8.91637C3.3203 8.97076 3.40901 9 3.5 9C3.59099 9 3.6797 8.97076 3.75375 8.91637C3.88675 8.81962 7.01265 6.49805 6.99996 3.60003C6.99996 1.61506 5.42979 0 3.5 0C1.57021 0 3.85161e-05 1.61506 3.85161e-05 3.59778C-0.0126488 6.49805 3.11325 8.81962 3.24625 8.91637ZM3.5 0.900007C4.94767 0.900007 6.12497 2.11097 6.12497 3.60228C6.13416 5.59939 4.20524 7.39266 3.5 7.98081C2.7952 7.39221 0.865841 5.59849 0.875029 3.60003C0.875029 2.11097 2.05233 0.900007 3.5 0.900007Z"
                        fill="black" />
                </svg>
            </div>
            <h1 class="main__temperature">${temp.toFixed()}°</h1>
            <h5 class="main__feels-like">Feels like ${feels_like.toFixed()}°</h5>
            
        </div>
        <div class="main__image-c">
            <img class="main__image" alt="" src="http://openweathermap.org/img/wn/${photoId}@2x.png">
            <h3 class="main__desc">${main}</h3>
        </div>
  `

  detailsEl.innerHTML = `<div class="section-details__wave">
            <div class="details-bar">
                <div class="details-bar__container pressure">
                    <svg class="details-bar__icon pressure-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7 0.297531C3.13438 0.297531 0 3.34719 0 7.10834C0 10.8695 3.13438 13.9192 7 13.9192C10.8656 13.9192 14 10.8695 14 7.10834C14 3.34719 10.8656 0.297531 7 0.297531ZM7 12.7637C3.79063 12.7637 1.1875 10.231 1.1875 7.10834C1.1875 3.98571 3.79063 1.45294 7 1.45294C10.2094 1.45294 12.8125 3.98571 12.8125 7.10834C12.8125 10.231 10.2094 12.7637 7 12.7637Z"
                            fill="#F37E11" />
                        <path d="M7 3.21645V7.10834L7 10.5137" stroke="#F37E11" />
                    </svg>
                    <h3 class="details-bar__value pressure-value">${pressure}hPa</h3>
                </div>
                <div class="details-bar__container water">
                    <svg class="details-bar__icon water-icon" width="17" height="17" viewBox="0 0 17 17" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.95833 10.6354C4.95833 11.5493 5.33147 12.4258 5.99566 13.072C6.65986 13.7183 7.56069 14.0813 8.5 14.0813C9.43931 14.0813 10.3401 13.7183 11.0043 13.072C11.6685 12.4258 12.0417 11.5493 12.0417 10.6354C12.0417 9.44583 10.8658 7.16806 8.5 3.98263C6.13417 7.16806 4.95833 9.44583 4.95833 10.6354ZM8.5 1.67591C11.8058 5.87307 13.4583 8.85933 13.4583 10.6354C13.4583 11.9149 12.9359 13.1419 12.0061 14.0467C11.0762 14.9514 9.81503 15.4597 8.5 15.4597C7.18497 15.4597 5.9238 14.9514 4.99393 14.0467C4.06406 13.1419 3.54167 11.9149 3.54167 10.6354C3.54167 8.85933 5.19421 5.87307 8.5 1.67591Z"
                            fill="#F37E11" />
                    </svg>

                    <h3 class="details-bar__value water-value">${humidity}%</h3>
                </div>
                <div class="details-bar__container wind">
                    <svg class="details-bar__icon wind-icon" width="17" height="15" viewBox="0 0 17 15" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13 1.95969C12.337 1.95969 11.7011 2.21597 11.2322 2.67214C10.7634 3.12831 10.5 3.747 10.5 4.39213C10.5 4.52115 10.4473 4.64489 10.3536 4.73612C10.2598 4.82736 10.1326 4.87861 10 4.87861C9.86739 4.87861 9.74021 4.82736 9.64645 4.73612C9.55268 4.64489 9.5 4.52115 9.5 4.39213C9.5 3.7186 9.70527 3.0602 10.0899 2.50018C10.4744 1.94017 11.0211 1.50369 11.6606 1.24594C12.3001 0.988195 13.0039 0.920756 13.6828 1.05215C14.3617 1.18355 14.9854 1.50789 15.4749 1.98414C15.9644 2.4604 16.2977 3.06718 16.4327 3.72776C16.5678 4.38835 16.4985 5.07306 16.2336 5.69532C15.9687 6.31757 15.5201 6.84943 14.9445 7.22362C14.3689 7.59781 13.6922 7.79753 13 7.79753H1C0.867392 7.79753 0.740215 7.74628 0.646447 7.65504C0.552678 7.56381 0.5 7.44007 0.5 7.31104C0.5 7.18202 0.552678 7.05828 0.646447 6.96705C0.740215 6.87581 0.867392 6.82456 1 6.82456H13C13.663 6.82456 14.2989 6.56828 14.7678 6.11212C15.2366 5.65595 15.5 5.03725 15.5 4.39213C15.5 3.747 15.2366 3.12831 14.7678 2.67214C14.2989 2.21597 13.663 1.95969 13 1.95969ZM6 2.93267C5.73478 2.93267 5.48043 3.03518 5.29289 3.21764C5.10536 3.40011 5 3.64759 5 3.90564C5 4.03466 4.94732 4.1584 4.85355 4.24964C4.75979 4.34087 4.63261 4.39213 4.5 4.39213C4.36739 4.39213 4.24021 4.34087 4.14645 4.24964C4.05268 4.1584 4 4.03466 4 3.90564C4 3.52077 4.1173 3.14454 4.33706 2.82453C4.55682 2.50452 4.86918 2.2551 5.23463 2.10782C5.60009 1.96054 6.00222 1.922 6.39018 1.99708C6.77814 2.07217 7.13451 2.2575 7.41421 2.52965C7.69392 2.80179 7.8844 3.14853 7.96157 3.526C8.03874 3.90348 7.99913 4.29475 7.84776 4.65032C7.69638 5.0059 7.44004 5.30981 7.11114 5.52363C6.78224 5.73746 6.39556 5.85159 6 5.85159H1C0.867392 5.85159 0.740215 5.80033 0.646447 5.7091C0.552678 5.61786 0.5 5.49412 0.5 5.3651C0.5 5.23607 0.552678 5.11233 0.646447 5.0211C0.740215 4.92987 0.867392 4.87861 1 4.87861H6C6.26522 4.87861 6.51957 4.7761 6.70711 4.59363C6.89464 4.41117 7 4.16369 7 3.90564C7 3.64759 6.89464 3.40011 6.70711 3.21764C6.51957 3.03518 6.26522 2.93267 6 2.93267ZM0.5 9.25699C0.5 9.12797 0.552678 9.00423 0.646447 8.91299C0.740215 8.82176 0.867392 8.7705 1 8.7705H11.042C11.6353 8.7705 12.2154 8.9417 12.7087 9.26243C13.2021 9.58317 13.5866 10.039 13.8136 10.5724C14.0407 11.1058 14.1001 11.6927 13.9844 12.2589C13.8686 12.8251 13.5829 13.3452 13.1633 13.7534C12.7438 14.1616 12.2092 14.4396 11.6273 14.5523C11.0453 14.6649 10.4421 14.6071 9.89395 14.3862C9.34577 14.1652 8.87724 13.7911 8.54759 13.3111C8.21795 12.8311 8.042 12.2667 8.042 11.6894C8.042 11.5604 8.09468 11.4367 8.18845 11.3454C8.28221 11.2542 8.40939 11.2029 8.542 11.2029C8.67461 11.2029 8.80179 11.2542 8.89555 11.3454C8.98932 11.4367 9.042 11.5604 9.042 11.6894C9.042 12.0743 9.1593 12.4505 9.37906 12.7705C9.59882 13.0905 9.91118 13.34 10.2766 13.4872C10.6421 13.6345 11.0442 13.6731 11.4322 13.598C11.8201 13.5229 12.1765 13.3376 12.4562 13.0654C12.7359 12.7933 12.9264 12.4465 13.0036 12.0691C13.0807 11.6916 13.0411 11.3003 12.8898 10.9447C12.7384 10.5892 12.482 10.2853 12.1531 10.0714C11.8242 9.8576 11.4376 9.74348 11.042 9.74348H1C0.867392 9.74348 0.740215 9.69222 0.646447 9.60099C0.552678 9.50976 0.5 9.38601 0.5 9.25699Z"
                            fill="#F37E11" />
                    </svg>

                    <h3 class="details-bar__value wind-value">${windSpeed}km/h</h3>
                </div>
            </div>
        </div>`

  sunsetSectionEl.innerHTML = `<div class="sunset__container">
            <div class="sunset__sun-c">
                <svg class="sunset__sun" width="40" height="40" viewBox="0 0 40 40" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#FF5C00" />
                    <circle cx="20" cy="20" r="20" fill="url(#paint0_linear)" />
                    <defs>
                        <linearGradient id="paint0_linear" x1="20" y1="0" x2="20" y2="40"
                            gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFC076" />
                            <stop offset="0.412131" stop-color="#FFD3A0" stop-opacity="0.691998" />
                            <stop offset="1" stop-color="#F3A053" />
                        </linearGradient>
                    </defs>
                </svg>

                <h3 class="sunset__hour sun-hour"}>${sToTime(sunrise)}</h3>
            </div>
            <svg class="sunset__line" width="113" height="23" viewBox="0 0 113 23" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.52553C1 1.52553 27.5 -3.94893 56.75 11.5255C86 27 112.5 21.5255 112.5 21.5255"
                    stroke="#F4B510" />
            </svg>

            <div class="sunset__moon-c">
                <h3 class="sunset__hour moon-hour">${sToTime(sunset)}</h3>
                <svg class="sunset__moon" width="25" height="36" viewBox="0 0 25 36" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.4735 17.5024C14.4735 28.5478 32.0457 35.0024 21 35.0024C10.5 35.5 0 30.0457 0 19C0 6.49754 7.47354 1 18.5 0C30.9735 0 14.4735 0.98761 14.4735 17.5024Z"
                        fill="#FFC700" />
                    <path
                        d="M14.4735 17.5024C14.4735 28.5478 32.0457 35.0024 21 35.0024C10.5 35.5 0 30.0457 0 19C0 6.49754 7.47354 1 18.5 0C30.9735 0 14.4735 0.98761 14.4735 17.5024Z"
                        fill="url(#paint0_linear)" />
                    <defs>
                        <linearGradient id="paint0_linear" x1="18.9735" y1="2.5" x2="18.9735" y2="42.5"
                            gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FAE475" />
                            <stop offset="0.412131" stop-color="#E4D169" stop-opacity="0.58" />
                            <stop offset="1" stop-color="#F3C653" />
                        </linearGradient>
                    </defs>
                </svg>

            </div>
        </div>`
  const cityEl = document.querySelector('.main__city')


  cityEl.addEventListener('click', async () => {
    const location = await updateCoords(getCoordsData(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityEl.innerText}&key=AIzaSyCUjKqI_6yohkGHjURltQi4OrXz3mRhoDc`))
    const {
      lat,
      lng
    } = location
    map.setView(new L.LatLng(lat, lng), 8);
    showMap()

  })


}

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
  if (currentTranslate < 0 && currentTranslate > -slider.children[0].offsetWidth * slider.children.length + window.innerWidth - 100) {
    slider.style.transform = `translateX(${currentTranslate}px)`
  }
}

function animation() {
  setSliderPostion()
  if (isDragging) {
    requestAnimationFrame(animation)
  }
}
//

//ADDING TO LIBRARY

let addedCities = []

addToLibraryButton.addEventListener('click', libraryButtonFuncionality)

function libraryButtonFuncionality() {
  if(sideNavIsOpen === true){
    disableLibraryButton()
    return
  } 
  if (!addedCities.includes(actualCity)) {
    addToLibraryAnim(`Added to library &#128077;`)
  } else {
    addToLibraryAnim(`City already added`)
  }
  addToLibrary()
  addToLibraryButton.removeEventListener('click', libraryButtonFuncionality)
  window.setTimeout(() => addToLibraryButton.addEventListener('click', libraryButtonFuncionality), 1000)
}

function addToLibraryAnim(text) {
  const modal = document.createElement('div')
  modal.classList.add('add-info')
  modal.innerHTML = `${text}`
  document.body.appendChild(modal)
  window.setTimeout(() => {
    modal.style.animation = `modalAnim 1s both`
  }, 100)
  window.setTimeout(() => {
    modal.remove()
  }, 1000)
}

function addToLibrary() {
  if (!addedCities.includes(actualCity)) {
    addedCities.push(actualCity)
  }
  console.log(addedCities)
}

function disableLibraryButton(){
  addToLibraryButton.disabled = true
}

function enableLibraryButton(){
  addToLibraryButton.disabled = false
}

//NAVIGATION
const hamburgerButton = document.querySelector('.nav__button')
const closeNavBtn = document.querySelector('.side-nav__close')
const sideNav = document.querySelector('.side-nav')
let sideNavIsOpen = false

function openNav() {
  sideNav.classList.add('active')
  sideNavIsOpen = true
}

function closeNav() {
  sideNav.classList.remove('active')
  sideNavIsOpen = false
  enableLibraryButton()
}

hamburgerButton.addEventListener('click', openNav)
closeNavBtn.addEventListener('click', closeNav)


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



async function createMap(long, lat) {
  // const location = await updateCoords(getCoordsData(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCUjKqI_6yohkGHjURltQi4OrXz3mRhoDc`))
  // const {
  //   lat,
  //   lng
  // } = location
  map = L.map('map').setView([lat, long], 1);
  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=5YGqAQzCA1gKabtUXy20', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 10,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
  }).addTo(map);

  const marker = L.marker([lat, long]).addTo(map)
}

function showMap() {
  mapEl.classList.add('active')
}

function hideMap() {
  mapEl.classList.remove('active')
}

window.addEventListener('click', hideMap)