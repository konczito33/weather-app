import * as Lib from './library.js'
export function saveToStorage(city) {
    let citiesStorage
    if (localStorage.getItem('cities') === null) {
        citiesStorage = [];
    } else {
        citiesStorage = JSON.parse(localStorage.getItem('cities'));
    }
    if (!citiesStorage.includes(city)) {
        citiesStorage.push(city)
    } else {
        return
    }

    localStorage.setItem('cities', JSON.stringify(citiesStorage));
}

export function displayCitiesFromStorage() {
    let citiesStorage
    if (localStorage.getItem('cities') === null) {
        citiesStorage = [];
    } else {
        citiesStorage = JSON.parse(localStorage.getItem('cities'));
    }
    citiesStorage = JSON.parse(localStorage.getItem('cities'));
    if (!citiesStorage.length == 0) {
        citiesStorage.forEach(city => {
            Lib.displayLibraryCities(city)
        })
    } else return
}
