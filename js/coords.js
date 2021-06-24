export async function updateCoords(data) {
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

export async function getCoordsData(URL) {
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
