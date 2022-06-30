// --------- Aplication state

let mainContainer = null

let filter = 'ALL' // one of ALL, DONE, NOT-DONE
let sort = 'ASCENDING' // NONE, ASCENDING or DESCENDING

let searchPhrase = ''
let searchInputIsFocused = false
let newToDoName = ''
let newToDoInputIsFocused = false

let tasks = [
    {
        name: 'Wynieś śmieci',
        isCompleted: true,
    },
    {
        name: 'Ala ma kota',
        isCompleted: true,
    },
    {
        name: 'Zmyj naczunia',
        isCompleted: false,
    }
]

// ---------- Generic / helper functions

const sortDescending = function (taskA, taskB) {
    return -(taskA.name.localeCompare(taskB.name))
}

const sortAscending = function (taskA, taskB) {
    return taskA.name.localeCompare(taskB.name)
}

const sortNone = function (taskA, taskB) { return 0 }

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

const renderInput = function (onChange, value, focusCondition, className) {
    const input = document.createElement('input')
    input.className = className

    input.value = value

    input.addEventListener('input', onChange)

    focus(focusCondition, input)

    return input
}

// ---------- State changing functions

const onSearchPhraseChange = function (event) {
    searchInputIsFocused = true
    newToDoInputIsFocused = false
    searchPhrase = event.target.value
    update()
}

const filterByComplited = function (task) {
    if (filter === 'ALL') return true

    if (filter === 'DONE') return task.isCompleted

    if (filter === 'NOT-DONE') return !task.isCompleted

    return true
}

const filterBySearchPhrase = function (task) {
    const name = task.name.toLowerCase()
    const search = searchPhrase.toLowerCase()

    if (name.includes(search)) return true

    return false
}

const onFilterChange = function (filterValue) {
    filter = filterValue

    update()
}

const onNewToDoNameChange = function (event) {
    newToDoInputIsFocused = true
    searchInputIsFocused = false
    newToDoName = event.target.value
    update()
}

const onNewToDoSubmit = function (event) {
    event.preventDefault()

    newToDoName

    tasks = tasks.concat({
        name: newToDoName,
        isCompleted: false
    })

    newToDoName = ''

    update()

}

const onTaskComplitedToggle = function (indexToToggle) {

    tasks = tasks.map(function (task, index) {
        if (index !== indexToToggle) return task

        return {
            name: task.name,
            isCompleted: !task.isCompleted,
        }
    })

    update()

}

const onTaskDelete = function (indexToDelete) {

    tasks = tasks.filter(function (task, index) {
        return index !== indexToDelete
    })

    update()

}

const renderButton = function (label, onClick, className) {
    const button = document.createElement('button')
    button.className = className

    if (onClick) {
        button.addEventListener('click', onClick)
    }

    button.innerText = label

    return button
}

// ------------- Rendering functions

const renderTask = function (task, onTaskToggle, onDelete) {
    const container = document.createElement('li')
    const wrapper = document.createElement('div')
    const textContainer = document.createElement('span')

    container.className = 'toodo-list__list-item'
    wrapper.className = 'toodo-list__list-item--wrapper'
    textContainer.className = 'toodo-list__list-item--textContainer'
    if (task.isCompleted) {
        container.className = container.className + ' toodo-list__list-item--complited'
    }

    const deleteButton = renderButton(
        'X',
        onDelete,
        'toodo-list__button toodo-list__button--delete')

    container.addEventListener('click', onTaskToggle)

    const text = document.createTextNode(task.name)

    textContainer.appendChild(text)
    wrapper.appendChild(textContainer)
    wrapper.appendChild(deleteButton)

    container.appendChild(wrapper)

    return container
}

const renderTasksList = function (tasks) {
    const container = document.createElement('ol')
    container.className = 'toodo-list__list'

    const tasksElements = tasks.map(function (task, index) {
        return renderTask(
            task,
            function () { onTaskComplitedToggle(index) },
            function () { onTaskDelete(index) })
    })

    appendArray(tasksElements, container)

    return container
}

const renderNewTaskButton = function (label) {
    return renderButton(label, null, 'toodo-list__button')
}

const renderNewTaskInput = function () {
    return renderInput(
        onNewToDoNameChange,
        newToDoName,
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

const renderFilterButton = function (filterValue, activeFilter) {
    let className = 'toodo-list__button toodo-list__button--filter'
    if (filterValue === activeFilter) {
        className = className + ' toodo-list__button--filter toodo-list__button--filter-active'
    }

    return renderButton(
        filterValue,
        function () { onFilterChange(filterValue) },
        className)

}

const renderFilters = function (activeFilter) {
    const container = document.createElement('div')
    container.className = 'toodo-list__filters'

    const buttonAll = renderFilterButton('ALL', activeFilter)
    const buttonDone = renderFilterButton('DONE', activeFilter)
    const buttonNotDone = renderFilterButton('NOT-DONE', activeFilter)

    container.appendChild(buttonAll)
    container.appendChild(buttonDone)
    container.appendChild(buttonNotDone)

    return container
}

const renderSearch = function () {
    const container = document.createElement('div')
    container.className = 'toodo-list__search'

    const input = renderInput(
        onSearchPhraseChange,
        searchPhrase,
        searchInputIsFocused,
        'toodo-list__input')

    container.appendChild(input)

    return container
}

const render = function () {
    const container = document.createElement('div')
    container.className = 'toodo-list'

    const filterTasks = tasks
        .filter(filterByComplited)
        .filter(filterBySearchPhrase)

    const sortedTasks = filterTasks
        .slice()
        .sort(function (taskA, taskB) {
            if (sort === 'NONE') {
                return sortNone(taskA, taskB)
            }
            if (sort === 'ASCENDING') {
                return sortAscending(taskA, taskB)
            }
            return sortDescending(taskA, taskB)
        })

    const searchElement = renderSearch()
    const filtersElement = renderFilters(filter)
    const newTastForm = renderNewTastForm()
    const taskListElement = renderTasksList(sortedTasks)

    container.appendChild(searchElement)
    container.appendChild(filtersElement)
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