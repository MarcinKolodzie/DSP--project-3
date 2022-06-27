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
    }
]

const appendArray = function (array, container) {
    array.forEach(function (element) {
        container.appendChild(element)
    })
}


const renderTask = function (task) {
    const container = document.createElement('div')
    container.className = 'toodo-list__list-item'

    container.innerText = task.name

    return container
}

const renderTasksList = function (tasks) {
    const container = document.createElement('div')
    container.className = 'toodo-list__list'

    const tasksElements = tasks.map((task) => {
        return renderTask(task)
    })

    appendArray(tasksElements, container)

    return container
}

const render = function () {
    const container = document.createElement('div')
    container.className = 'toodo-list'

    const taskListElement = renderTasksList(tasks)

    container.appendChild(taskListElement)

    return container
}

const init = function (selector) {

    const container = document.querySelector(selector)

    if (!container) {
        console.log('Container do not exist!')
        return
    }

    mainContainer = container

    const app = render()

    mainContainer.appendChild(app)

}

init('.root')