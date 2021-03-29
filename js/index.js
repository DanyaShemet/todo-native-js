let myNodeList = document.querySelector('#myUl');
let close = document.querySelectorAll('.close');
const tasksListElement = document.querySelector(`.tasks__list`);
const sortElements = document.querySelector(`.sort-wrap`);
const filterElements = document.querySelector(`.filter-wrap`);
const taskElements = document.querySelectorAll(`.task`);
let arrayChildren;

let state = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
    filter: JSON.parse(localStorage.getItem('filter') || '[]'),
    info: {canFilter: false, canSort: false},
    sorted: JSON.parse(localStorage.getItem('sorted') || '[]'),
};


function render() {
    let inputValue = document.getElementById('myInput').value = '';
    while (myNodeList.firstChild) {
        myNodeList.removeChild(myNodeList.firstChild);
    }
    for (let i = 0; i < state.tasks.length; i++) {

        myNodeList.insertAdjacentHTML('beforeend',
            `<li class="${state.tasks[i].checked ? `checked` : ''} 
                    ${state.tasks[i].status === "complete" ? `complete` : ''} 
                    ${state.tasks[i].hidden ? `hidden` : ''} 
                
                    ${(new Date() > new Date(state.tasks[i].endDate) || state.tasks[i].status === "outcome") ? 'outcome' : ''}
                    ${state.tasks[i].redaction ? `redaction` : ''} task" 
                    data-id="${state.tasks[i].id}" 
                    draggable="${state.tasks[i].draggable}">
                        <button class="after-check" id="done">Выполнено</button>
                        <button class="after-check" id="loading" >В процессе</button>
                        <button class="after-check" id="undone"  > Не выполнено</button>
                    <div>
                        <p> ${state.tasks[i].redaction
                ? `<input type="text" value="${state.tasks[i].name}" id="update-input" class="redaction"/>`
                : `<span>${state.tasks[i].name} </span>`}
                        ${(state.tasks[i].status === "complete" || state.tasks[i].status === "outcome") ? '' : ` <small id="${state.tasks[i].redaction ? 'save' : 'change'}" >
                        ${state.tasks[i].redaction ? 'Сохранить' : 'Редактировать'}</small> 
                        ${!state.tasks[i].redaction ? '' : `<small id="back">Назад</small>`}`}</p>
                        ${state.tasks[i].redaction
                ? `<input type="date" value="${new Date(state.tasks[i].endDate).getFullYear()}-${new Date(state.tasks[i].endDate).getMonth() + 1 < 10 ? `0${new Date(state.tasks[i].endDate).getMonth() + 1}`
                    : new Date(state.tasks[i].endDate).getMonth() + 1}-${new Date(state.tasks[i].endDate).getDate() < 10
                    ? `0${new Date(state.tasks[i].endDate).getDate()}`
                    : new Date(state.tasks[i].endDate).getDate()}" id="update-date" />`
                : `<div class="date"> 
                                        <span>Start date: <b class="start-date">${new Date(state.tasks[i].startDate).toLocaleDateString()}</b></span>
                                        <span>End date <b class="end-date">${new Date(state.tasks[i].endDate).toLocaleDateString()}</b></span>
                                        </div>`}
                    </div>
                        ${state.tasks[i].closable ? `  <span class="close" id="close">\u00D7</span>` : ''}
                </li>`)
    }

    state.filter.includes('complete') ? document.querySelector('#sort-complete').classList.add('active') : document.querySelector('#sort-complete').classList.remove('active')
    state.filter.includes('outcome') ? document.querySelector('#sort-outcome').classList.add('active') : document.querySelector('#sort-outcome').classList.remove('active')
    state.filter.includes('process') ? document.querySelector('#sort-process').classList.add('active') : document.querySelector('#sort-process').classList.remove('active')

    state.sorted === "sortName" ? document.querySelector('#sort-name').classList.add('active') : document.querySelector('#sort-name').classList.remove('active')
    state.sorted === "sortDate" ? document.querySelector('#sort-date').classList.add('active') : document.querySelector('#sort-date').classList.remove('active')
    state.sorted === "sortStatus" ? document.querySelector('#sort-status').classList.add('active') : document.querySelector('#sort-status   ').classList.remove('active')


}

function renderSortBtn() {
    state.info.canFilter ? document.querySelector('.filter-btn-wrap').classList.add('active') : document.querySelector('.filter-btn-wrap').classList.remove('active')
    state.info.canSort ? document.querySelector('.sort-btn-wrap').classList.add('active') : document.querySelector('.sort-btn-wrap').classList.remove('active')
}

function deleteEL(id) {
    state.tasks = state.tasks.filter(t => t.id !== id)
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
    render()
}


function check(id) {
    let [task, idx] = getTask(id);
    const status = !task.checked;
    state.tasks[idx] = {...task, checked: status}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

function completeTask(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, status: "complete", checked: false}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()

}

function outcomeTask(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, status: "outcome", checked: false}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

function loadingTask(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, checked: false, status: "process"}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

function redactTask(id) {
    let [task, idx] = getTask(id);

    let updateInput = document.getElementById('update-input').value;
    let startDate = state.tasks[idx].startDate;
    let endDate = document.getElementById('update-date').value;

    let updateTask;
    if (updateInput !== '' && new Date(endDate) > new Date()) {
        updateTask = {
            name: updateInput,
            startDate,
            endDate: new Date(endDate).toLocaleDateString('en-US'),
        }
    }

    state.tasks[idx] = {...task, ...updateTask, redaction: !state.tasks[idx].redaction}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

function toggleRedaction(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, redaction: !state.tasks[idx].redaction}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}


function getTask(id) {
    const idx = state.tasks.findIndex(t => t.id === id)
    const task = state.tasks[idx];
    return [task, idx]
}

function filterComplete(el, key) {
    el.classList.toggle('active')
    state.filter.includes(key) ? state.filter.splice(state.filter.indexOf(key), 1) : state.filter.push(key)
    localStorage.setItem('filter', JSON.stringify(state.filter));

    state.filter.length >= 1 ? state.tasks.map(t => {t.hidden = state.filter.indexOf(t.status) === -1}) : state.tasks.map(t => t.hidden = false)

    render()
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
}

function resetFilter(){

    state.filter = []
    localStorage.removeItem('filter')
    state.tasks.map(t => t.hidden = false)
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
    render()

}




function newElement() {

    let inputValue = document.getElementById('myInput').value;
    let startDate = new Date().toLocaleDateString('en-US');
    let endDate = document.getElementById('date').value;

    if (inputValue === '') {
        alert('Введите текст и коректную дату')
    } else {
        const task = {
            id: Date.now(),
            name: inputValue,
            closable: true,
            checked: false,
            status: "process",
            startDate,
            endDate: new Date(endDate).toLocaleDateString('en-US'),
            redaction: false,
            draggable: true,
            hidden: false,

        };
        state.tasks.push(task)
        state.sorted === 'sortName' ? sortName() : state.sorted === 'sortDate' ? sortDate() : state.sorted === 'sortStatus' ? sortStatus() : ''
        localStorage.setItem('tasks', JSON.stringify(state.tasks));

        render()
    }
}


render()

window.onkeypress = function (e) {
    if (e.which === 13 && (state.tasks.every(task => !task.redaction) || !state.tasks)) {
        newElement()
    }
}

myNodeList.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI' && !ev.target.classList.contains('redaction')) {
        check(+ev.target.dataset.id)
    } else if (ev.target.id === 'done') {
        completeTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'undone') {
        outcomeTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'loading') {
        loadingTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'change') {
        toggleRedaction(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'save') {
        redactTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'close') {
        deleteEL(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'back') {
        toggleRedaction(+ev.target.offsetParent.dataset.id)
    }
}, false);


sortElements.addEventListener('click', (e) => {
    if (e.target.id === "sort"){
        state.info.canSort = !state.info.canSort
        renderSortBtn()
    }
    if (e.target.id === "sort-name") {
        sortName()
    } else if (e.target.id === "sort-date") {
        sortDate()
    } else if (e.target.id === "sort-status") {
        sortStatus()
    }
})

filterElements.addEventListener('click', (e) => {
    if (e.target.id === "filter") {
        state.info.canFilter = !state.info.canFilter
        renderSortBtn()
    } else if (e.target.id === "sort-complete") {
        filterComplete(e.target, 'complete')
    } else if (e.target.id === "sort-outcome") {
        filterComplete(e.target, 'outcome')
    } else if (e.target.id === 'sort-process') {
        filterComplete(e.target, 'process')
    }
    else {
        resetFilter()
    }

})

function sortName() {
    state.tasks.sort((a, b) => {
        if (a.name > b.name) {
            return 1
        }
        if (a.name < b.name) {
            return -1
        }
        return 0
    });
    state.sorted = 'sortName'
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('sorted', JSON.stringify(state.sorted));
    render()
}

function sortDate() {

    state.tasks.sort((a, b) => {
        if (new Date(a.endDate) > new Date(b.endDate)) {
            return 1
        }
        if (new Date(a.endDate) < new Date(b.endDate)) {
            return -1
        }
        return 0
    });
    state.sorted = 'sortDate'
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('sorted', JSON.stringify(state.sorted));
    render()
}

function sortStatus() {
    state.tasks.sort((a, b) => {
        if (a.status > b.status) {
            return 1
        }
        if (a.status < b.status) {
            return -1
        }
        return 0
    });
    state.sorted = 'sortStatus'
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('sorted', JSON.stringify(state.sorted));
    render()
}


tasksListElement.addEventListener(`dragstart`, (evt) => {
    evt.target.classList.add(`selected`);
});

tasksListElement.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
    arrayChildren = Array.from(myNodeList.childNodes)
    arrayChildren.forEach((t, index) => {
        if (state.tasks[index].id !== +t.dataset.id) {
            let [task, idx] = getTask(state.tasks[index].id)
            let [changeTask, changeIdx] = getTask(+t.dataset.id)
            let tmp = state.tasks[idx]
            state.tasks[idx] = {...state.tasks[changeIdx]}
            state.tasks[changeIdx] = {...tmp}
        }
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
    })
});

const getNextElement = (cursorPosition, currentElement) => {
    const currentElementCoord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    const nextElement = (cursorPosition < currentElementCenter) ?
        currentElement :
        currentElement.nextElementSibling;

    return nextElement;
};

tasksListElement.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();

    const activeElement = tasksListElement.querySelector(`.selected`);
    const currentElement = evt.target;

    const isMoveable = activeElement !== currentElement &&
        currentElement.classList.contains(`task`);

    if (!isMoveable) {
        return;
    }

    const nextElement = getNextElement(evt.clientY, currentElement);

    if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
        return;
    }


    tasksListElement.insertBefore(activeElement, nextElement);
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
});
