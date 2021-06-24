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

export { timeFormat, sToTime, getDay}