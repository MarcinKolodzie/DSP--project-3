const createToDoInit = function () {

    // --------- Aplication state

    let mainContainer = null

    let filter = 'ALL' // one of ALL, DONE, NOT-DONE
    let sort = 'NONE' // NONE, ASCENDING or DESCENDING

    let searchPhrase = ''
    let searchInputIsFocused = false
    let newToDoName = ''
    let newToDoInputIsFocused = false

    let tasks = []

    const loadFromLocalStorage = function () {
        const state = JSON.parse(localStorage.getItem('todo'))

        if (!state) return

        filter = state.filter
        sort = state.sort
        searchPhrase = state.searchPhrase
        searchInputIsFocused = state.searchInputIsFocused
        newToDoName = state.newToDoName
        newToDoInputIsFocused = state.newToDoInputIsFocused
        tasks = state.tasks
    }

    const saveToLocalStorage = function () {
        const state = {
            mainContainer: mainContainer,
            filter: filter,
            sort: sort,
            searchPhrase: searchPhrase,
            searchInputIsFocused: searchInputIsFocused,
            newToDoName: newToDoName,
            newToDoInputIsFocused: newToDoInputIsFocused,
            tasks: tasks,
        }

        localStorage.setItem('todo', JSON.stringify(state))
    }

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

    const generateTimestampId = function(){
        return Date.now() + '-' + Math.round(Math.random() * 1000000)
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

    const onSortChange = function (sortValue) {
        sort = sortValue

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

        tasks = tasks.concat({
            name: newToDoName,
            isCompleted: false,
            id: generateTimestampId(),
        })

        newToDoName = ''

        update()

    }

    const onTaskComplitedToggle = function (idToToggle) {

        tasks = tasks.map(function (task) {
            if (tasks.id !== idToToggle) return task

            return {
                name: task.name,
                isCompleted: !task.isCompleted,
                id: task.id,
            }
        })

        update()

    }

    const onTaskDelete = function (idToDelete) {

        tasks = tasks.filter(function (task) {
            return task.id !== idToDelete
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

        const tasksElements = tasks.map(function (task) {
            return renderTask(
                task,
                function () { onTaskComplitedToggle(task.id) },
                function () { onTaskDelete(task.id) })
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

    const renderSortButton = function (sortValue, activeSort) {
        let className = 'toodo-list__button toodo-list__button--sort'
        if (sortValue === activeSort) {
            className = className + ' toodo-list__button--sort toodo-list__button--sort-active'
        }

        return renderButton(
            sortValue,
            function () { onSortChange(sortValue) },
            className)

    }

    const renderSortButtons = function (activeSort) {
        const container = document.createElement('div')
        container.className = 'toodo-list__sort'

        const buttonNone = renderSortButton('NONE', activeSort)
        const buttonAscending = renderSortButton('ASCENDING', activeSort)
        const buttonDescending = renderSortButton('DESCENDING', activeSort)

        container.appendChild(buttonNone)
        container.appendChild(buttonAscending)
        container.appendChild(buttonDescending)

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
        const sortButtonsElement = renderSortButtons(sort)
        const newTastForm = renderNewTastForm()
        const taskListElement = renderTasksList(sortedTasks)

        container.appendChild(searchElement)
        container.appendChild(filtersElement)
        container.appendChild(sortButtonsElement)
        container.appendChild(newTastForm)
        container.appendChild(taskListElement)

        return container
    }

    const update = function () {
        mainContainer.innerHTML = ''

        const app = render()

        saveToLocalStorage()

        mainContainer.appendChild(app)
    }

    const init = function (selector) {

        const container = document.querySelector(selector)

        if (!container) {
            console.log('Container do not exist!')
            return
        }

        loadFromLocalStorage()

        mainContainer = container

        const app = render()

        mainContainer.appendChild(app)

    }

    return init

}