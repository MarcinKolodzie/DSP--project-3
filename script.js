let mainContainer = null

let filter = 'ALL' // one of ALL, DONE, NOT-DONE
let sort = 'ASCENDING' // ASCENDING or DESCENDING

let searchPhrase = ''
let searchInputIsFocused = false
let newToDoName = ''
let newToDoInputIsFocused = false

let tasks = [
    {
        name: 'Wynieś śmieci',
        isCompleted: true,
    },
]

const appendArray = function (array, container) {
    array.forEach(function (element) {
        container.appendChild(element)
    })
}

const render = function () {
    return document.createTextNode('habcibi')
}

const init = function (selector) {
    const container = document.querySelector(selector)

    if (!container) return
    console.log('Container do not exist')

    mainContainer = container

    const app = render()

    mainContainer.appendChild(app)
}

init('.root')