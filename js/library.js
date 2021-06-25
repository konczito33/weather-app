import {
    updateCoords,
    getCoordsData
} from './coords.js'
import {
    getData,
    displayActualData
} from './getdata.js'
import {
    actualCity
} from './getdata.js'
import {
    sideNavIsOpen
} from './sidenav.js'
import {
    saveToStorage
} from './localstorage.js'


export const libraryButton = document.querySelector('.side-nav__link')
export const libraryContainer = document.querySelector('.library')
export const addToLibraryButton = document.querySelector('.nav__add')
export let addedCities = []

addToLibraryButton.addEventListener('click', libraryButtonFuncionality)

function libraryButtonFuncionality() {
    let citiesStorage
    if (localStorage.getItem('cities') === null) {
        citiesStorage = [];
    } else {
        citiesStorage = JSON.parse(localStorage.getItem('cities'));
    }
    if (sideNavIsOpen === true) {
        disableLibraryButton()
        return
    }
    if (!addedCities.includes(actualCity) && !citiesStorage.includes(actualCity)) {
        addToLibraryAnim(`Added to library &#128077;`)
    } else {
        addToLibraryAnim(`City already added`)
    }
    addToLibrary()
    addToLibraryButton.removeEventListener('click', libraryButtonFuncionality)
    window.setTimeout(() => addToLibraryButton.addEventListener('click', libraryButtonFuncionality), 1000)
    saveToStorage(actualCity)
    console.log(addedCities)
}




export function activeLibrary() {
    libraryContainer.classList.add('active')
}

export function removeLibrary() {
    libraryContainer.classList.remove('active')
}

async function returnLibraryCitiesData(city) {
    try {
        const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`)
        const data = await fetchData.json()
        return data

    } catch (err) {
        console.log(err)
    }
}

export async function displayLibraryCities(city) {
  libraryContainer.innerHTML = `<button class="library__button">Back</button>`
    const resData = await returnLibraryCitiesData(city)
    const {
        humidity,
        temp
    } = resData.main
    const {
        speed: windSpeed
    } = resData.wind
    const {
        icon: photoId,
    } = resData.weather[0]
    const cityEl = document.createElement('div')
    cityEl.classList.add('library__item')
    cityEl.innerHTML = `
          <div class="library__city">
            <div class="library__temp-c">
                <h2 class='library__temp'>${temp.toFixed()}°</h2>
                <img class="library__img" src="http://openweathermap.org/img/wn/${photoId}@2x.png" alt="">
            </div>
            <h3 class="library__city">${city}</h3>
            <ul class="library__list">
                <li class="library__detail"><svg class="library__icon" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.95833 10.6354C4.95833 11.5493 5.33147 12.4258 5.99566 13.072C6.65986 13.7183 7.56069 14.0813 8.5 14.0813C9.43931 14.0813 10.3401 13.7183 11.0043 13.072C11.6685 12.4258 12.0417 11.5493 12.0417 10.6354C12.0417 9.44583 10.8658 7.16806 8.5 3.98263C6.13417 7.16806 4.95833 9.44583 4.95833 10.6354ZM8.5 1.67591C11.8058 5.87307 13.4583 8.85933 13.4583 10.6354C13.4583 11.9149 12.9359 13.1419 12.0061 14.0467C11.0762 14.9514 9.81503 15.4597 8.5 15.4597C7.18497 15.4597 5.9238 14.9514 4.99393 14.0467C4.06406 13.1419 3.54167 11.9149 3.54167 10.6354C3.54167 8.85933 5.19421 5.87307 8.5 1.67591Z" fill="#F37E11"/>
                    </svg>${humidity}%<li>
                <li class="library__detail"><svg class="library__icon width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1.95969C12.337 1.95969 11.7011 2.21597 11.2322 2.67214C10.7634 3.12831 10.5 3.747 10.5 4.39213C10.5 4.52115 10.4473 4.64489 10.3536 4.73612C10.2598 4.82736 10.1326 4.87861 10 4.87861C9.86739 4.87861 9.74021 4.82736 9.64645 4.73612C9.55268 4.64489 9.5 4.52115 9.5 4.39213C9.5 3.7186 9.70527 3.0602 10.0899 2.50018C10.4744 1.94017 11.0211 1.50369 11.6606 1.24594C12.3001 0.988195 13.0039 0.920756 13.6828 1.05215C14.3617 1.18355 14.9854 1.50789 15.4749 1.98414C15.9644 2.4604 16.2977 3.06718 16.4327 3.72776C16.5678 4.38835 16.4985 5.07306 16.2336 5.69532C15.9687 6.31757 15.5201 6.84943 14.9445 7.22362C14.3689 7.59781 13.6922 7.79753 13 7.79753H1C0.867392 7.79753 0.740215 7.74628 0.646447 7.65504C0.552678 7.56381 0.5 7.44007 0.5 7.31104C0.5 7.18202 0.552678 7.05828 0.646447 6.96705C0.740215 6.87581 0.867392 6.82456 1 6.82456H13C13.663 6.82456 14.2989 6.56828 14.7678 6.11212C15.2366 5.65595 15.5 5.03725 15.5 4.39213C15.5 3.747 15.2366 3.12831 14.7678 2.67214C14.2989 2.21597 13.663 1.95969 13 1.95969ZM6 2.93267C5.73478 2.93267 5.48043 3.03518 5.29289 3.21764C5.10536 3.40011 5 3.64759 5 3.90564C5 4.03466 4.94732 4.1584 4.85355 4.24964C4.75979 4.34087 4.63261 4.39213 4.5 4.39213C4.36739 4.39213 4.24021 4.34087 4.14645 4.24964C4.05268 4.1584 4 4.03466 4 3.90564C4 3.52077 4.1173 3.14454 4.33706 2.82453C4.55682 2.50452 4.86918 2.2551 5.23463 2.10782C5.60009 1.96054 6.00222 1.922 6.39018 1.99708C6.77814 2.07217 7.13451 2.2575 7.41421 2.52965C7.69392 2.80179 7.8844 3.14853 7.96157 3.526C8.03874 3.90348 7.99913 4.29475 7.84776 4.65032C7.69638 5.0059 7.44004 5.30981 7.11114 5.52363C6.78224 5.73746 6.39556 5.85159 6 5.85159H1C0.867392 5.85159 0.740215 5.80033 0.646447 5.7091C0.552678 5.61786 0.5 5.49412 0.5 5.3651C0.5 5.23607 0.552678 5.11233 0.646447 5.0211C0.740215 4.92987 0.867392 4.87861 1 4.87861H6C6.26522 4.87861 6.51957 4.7761 6.70711 4.59363C6.89464 4.41117 7 4.16369 7 3.90564C7 3.64759 6.89464 3.40011 6.70711 3.21764C6.51957 3.03518 6.26522 2.93267 6 2.93267ZM0.5 9.25699C0.5 9.12797 0.552678 9.00423 0.646447 8.91299C0.740215 8.82176 0.867392 8.7705 1 8.7705H11.042C11.6353 8.7705 12.2154 8.9417 12.7087 9.26243C13.2021 9.58317 13.5866 10.039 13.8136 10.5724C14.0407 11.1058 14.1001 11.6927 13.9844 12.2589C13.8686 12.8251 13.5829 13.3452 13.1633 13.7534C12.7438 14.1616 12.2092 14.4396 11.6273 14.5523C11.0453 14.6649 10.4421 14.6071 9.89395 14.3862C9.34577 14.1652 8.87724 13.7911 8.54759 13.3111C8.21795 12.8311 8.042 12.2667 8.042 11.6894C8.042 11.5604 8.09468 11.4367 8.18845 11.3454C8.28221 11.2542 8.40939 11.2029 8.542 11.2029C8.67461 11.2029 8.80179 11.2542 8.89555 11.3454C8.98932 11.4367 9.042 11.5604 9.042 11.6894C9.042 12.0743 9.1593 12.4505 9.37906 12.7705C9.59882 13.0905 9.91118 13.34 10.2766 13.4872C10.6421 13.6345 11.0442 13.6731 11.4322 13.598C11.8201 13.5229 12.1765 13.3376 12.4562 13.0654C12.7359 12.7933 12.9264 12.4465 13.0036 12.0691C13.0807 11.6916 13.0411 11.3003 12.8898 10.9447C12.7384 10.5892 12.482 10.2853 12.1531 10.0714C11.8242 9.8576 11.4376 9.74348 11.042 9.74348H1C0.867392 9.74348 0.740215 9.69222 0.646447 9.60099C0.552678 9.50976 0.5 9.38601 0.5 9.25699Z" fill="#F37E11"/></svg>
                      ${windSpeed}km/h</li>
            </ul>
            <button class="library__removeBtn">X</button>
        </div>`
    cityEl.addEventListener('click', async (e) => {
        let long
        let lat
        const city = cityEl.querySelector('h3').innerText
        const location = await updateCoords(getCoordsData(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCUjKqI_6yohkGHjURltQi4OrXz3mRhoDc`))
        if (!location) displayError()
        long = location.lng
        lat = location.lat
        const resData = await (getData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=5937e48258dc7856eaf3f4e49ed820a0`))

        if (!e.target.classList.contains('library__removeBtn')) {
            displayActualData(resData)
            removeLibrary()
            enableLibraryButton()
        }
    })
    libraryContainer.appendChild(cityEl)
    const removeBtns = document.querySelectorAll('.library__removeBtn')
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.parentNode
            parent.parentNode.remove()
            deleteCityFromLocalStorage(e.target)
        })
    })
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
    let citiesStorage
    if (localStorage.getItem('cities') === null) {
        citiesStorage = [];
    } else {
        citiesStorage = JSON.parse(localStorage.getItem('cities'));
    }
    if (!addedCities.includes(actualCity) && !citiesStorage.includes(actualCity)) {
        addedCities.push(actualCity)
    }
}

export function disableLibraryButton() {
    addToLibraryButton.disabled = true
}

export function enableLibraryButton() {
    addToLibraryButton.disabled = false
}

function deleteCityFromLocalStorage(button) {
    let citiesStorage 
    if (localStorage.getItem('cities') === null) {
        citiesStorage = [];
    } else {
        citiesStorage = JSON.parse(localStorage.getItem('cities'));
    }
    const cityString = button.parentNode.querySelector('h3').innerText
    citiesStorage.splice(citiesStorage.indexOf(cityString), 1)
    const cityIndex = addedCities.indexOf(cityString)
    addedCities.splice(cityIndex, 1)
    localStorage.setItem('cities', JSON.stringify(citiesStorage))
}
