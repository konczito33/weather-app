export const map = L.map('map')
const mapEl = document.querySelector('.map')
export async function createMap(long, lat) {

    map.setView([lat, long], 1);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=5YGqAQzCA1gKabtUXy20', {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 10,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
    }).addTo(map);

    const marker = L.marker([lat, long]).addTo(map)
}

export function showMap() {
    mapEl.classList.add('active')
}

export function hideMap() {
    mapEl.classList.remove('active')
}
