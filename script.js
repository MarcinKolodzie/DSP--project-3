let mainContainer = null

let filter = 'ALL' // one of ALL, DONE, NOT-DONE
let sort = 'ASCENDING' // ASCENDING or DESCENDING

let searchPhrase = ''
let searchInputIsFocused = false
let newToDoName = 'hdhdh'
let newToDoInputIsFocused = false

let tasks = [
    {
        name: 'Wynieś śmieci',
        isCompleted: true,
    },
    {
        name: 'Zmuj naczunia',
        isCompleted: false,
    }
]

// ----------

const focus = function (condition, element) {
    if (condition) {

        setTimeout(
            function () {
                element.focus()
            },
            0
        )
    }
}

const appendArray = function (array, container) {
    array.forEach(function (element) {
        container.appendChild(element)
    })
}

const renderInput = function (onChange, focusCondition, className) {
    const input = document.createElement('input')
    input.className = className

    input.value = newToDoName

    input.addEventListener('input', onChange)

    focus(focusCondition, input)

    return input
}

// ----------

const onNewToDoNamechange = function (event) {
    newToDoInputIsFocused = true
    newToDoName = event.target.value
    update()
}

const onNewToDoSubmit = function(event){
event.preventDefault()

newToDoName

tasks = tasks.concat({
    name: newToDoName,
    isCompleted: false
})

newToDoName = ''

update()

}

// -------------

const renderTask = function (task) {
    const container = document.createElement('li')
    container.className = 'toodo-list__list-item'

    if (task.isCompleted) {
        container.className = container.className + ' toodo-list__list-item--complited'
    }

    container.innerText = task.name

    return container
}

const renderTasksList = function (tasks) {
    const container = document.createElement('ol')
    container.className = 'toodo-list__list'

    const tasksElements = tasks.map((task) => {
        return renderTask(task)
    })

    appendArray(tasksElements, container)

    return container
}

const renderNewTaskButton = function (label) {
    const button = document.createElement('button')
    button.className = 'toodo-list__button'

    button.innerText = label

    return button
}

const renderNewTaskInput = function () {
    return renderInput(
        onNewToDoNamechange,
        newToDoInputIsFocused,
        'toodo-list__input'
    )
}

const renderNewTastForm = function () {
    const container = document.createElement('form')
    container.className = 'toodo-list__form'

    container.addEventListener('submit', onNewToDoSubmit)

    const inputElement = renderNewTaskInput()
    const buttonElement = renderNewTaskButton('ADD')

    container.appendChild(inputElement)
    container.appendChild(buttonElement)

    return container
}

const render = function () {
    const container = document.createElement('div')
    container.className = 'toodo-list'

    const newTastForm = renderNewTastForm()
    const taskListElement = renderTasksList(tasks)

    container.appendChild(newTastForm)
    container.appendChild(taskListElement)

    return container
}

const update = function () {
    mainContainer.innerHTML = ''

    const app = render()

    mainContainer.appendChild(app)
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