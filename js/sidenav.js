export const hamburgerButton = document.querySelector('.nav__button')
export const closeNavBtn = document.querySelector('.side-nav__close')
export const sideNav = document.querySelector('.side-nav')
export let sideNavIsOpen = false

import { enableLibraryButton } from './library.js'

export function openNav() {
    sideNav.classList.add('active')
    sideNavIsOpen = true
}

export function closeNav() {
    sideNav.classList.remove('active')
    sideNavIsOpen = false
    enableLibraryButton()
}