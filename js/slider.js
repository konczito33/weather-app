import { slider } from "./main.js"
let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0


export function touchStart(idx) {
    return (e) => {
        currentIndex = idx
        startPos = getPostion(e)
        isDragging = true
        animationID = requestAnimationFrame(animation)
        slider.classList.add('grabbing')
    }
}

export function touchMove(e) {
    if (isDragging) {
        const currentPostion = getPostion(e)
        currentTranslate = prevTranslate + currentPostion - startPos
    }
}

export function touchEnd() {
    isDragging = false
    cancelAnimationFrame(animationID)
    slider.classList.remove('grabbing')
    setPosByIndex()
}

export function setPosByIndex() {
    prevTranslate = currentTranslate
    setSliderPostion()
}

export function getPostion(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
}

export function setSliderPostion() {
    if (currentTranslate < 0 && currentTranslate > -slider.children[0].offsetWidth * slider.children.length + window.innerWidth - 100) {
        slider.style.transform = `translateX(${currentTranslate}px)`
    }
}

export function animation() {
    setSliderPostion()
    if (isDragging) {
        requestAnimationFrame(animation)
    }
}
