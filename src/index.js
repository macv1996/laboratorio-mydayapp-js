import "./css/base.css";

//Variables Globales localStorage
let allTodos;
let completedTodos
let pendingTodos;

//NODOS HTML
const newTodoInput = document.querySelector('.new-todo')
const ulTodoList = document.querySelector('.todo-list')
const liAll = document.querySelector('.filters li:first-child a')
const liPending = document.querySelector('.filters li:nth-child(2) a')
const liCompleted = document.querySelector('.filters li:nth-child(3) a')
const mainTodos = document.querySelector('.main')
const footerTodos = document.querySelector('.footer')
const todoCountSapn = document.querySelector('.todo-count')
const clearCompleted = document.querySelector('.clear-completed')

//Escuchadores
window.addEventListener('DOMContentLoaded', navigationPage)
window.addEventListener('hashchange', navigationPage)
newTodoInput.addEventListener('keypress', (event) => {
  if (event.keyCode === 13 && newTodoInput.value.trim().length !== 0) {
    getNewTodo(newTodoInput.value.trim())
    window.location.hash = '#/'
    navigationPage()
  }
})
clearCompleted.addEventListener('click', () => {
  const todosNotCompleted = []
  allTodos.forEach(element => {
    if (element.completed === false) {
      todosNotCompleted.push(element)
    }
  });

  localStorage.setItem('mydayapp-js', JSON.stringify(todosNotCompleted))
  navigationPage()

})

//NAVEGACION
function navigationPage() {

  allTodos = JSON.parse(localStorage.getItem('mydayapp-js')) || []
  completedTodos = allTodos.filter(item=> item.completed === true)
  pendingTodos = allTodos.filter(item=> item.completed === false)

  completedTodos.length === 0?clearCompleted.style.display = 'none': clearCompleted.style.display = 'inline-block'
  totalItems()

  if (location.hash == '#/pending') {
    getPendingTodos()
    liPending.classList.add('selected')
    liCompleted.classList.remove('selected')
    liAll.classList.remove('selected')
  } else if (location.hash == '#/completed') {
    getCompletedTodos()
    liCompleted.classList.add('selected')
    liPending.classList.remove('selected')
    liAll.classList.remove('selected')
  } else {
    getAllTodos()
    liAll.classList.add('selected')
    liPending.classList.remove('selected')
    liCompleted.classList.remove('selected')
  }
}

//Paginas de los TODOS
function getPendingTodos() {
  const pendingTodos = allTodos.filter(element => element.completed === false)
  ulTodoList.innerHTML = ''
  insertTodo(pendingTodos)
}
function getCompletedTodos() {
  const completedTodos = allTodos.filter(element => element.completed === true)
  ulTodoList.innerHTML = ''
  insertTodo(completedTodos)
}
function getAllTodos() {
  ulTodoList.innerHTML = ''
  insertTodo(allTodos)
}

//UTILS
//funcion para capturar el nuevoTodo
function getNewTodo(value) {
  const newTodoText = value
  const idTodo = Math.random()
  const objectTodo = {
    id: `${newTodoText}${idTodo}`,
    title: newTodoText,
    completed: false
  }

  allTodos.push(objectTodo)
  localStorage.setItem('mydayapp-js', JSON.stringify(allTodos))
  newTodoInput.value = ''
  ulTodoList.innerHTML = ''
  getAllTodos()
}

//funcion para crear un insertar en HTML los TODOS
function insertTodo(listTodo) {

  listTodo.forEach(todo => {

    const liTodo = document.createElement('li')
    todo.completed === true ? liTodo.classList.add('completed') : liTodo.classList.remove('completed');
    const divTodo = document.createElement('div')
    divTodo.classList.add('view')

    const inputTodoCheckBox = document.createElement('input')
    inputTodoCheckBox.classList.add('toggle')
    inputTodoCheckBox.type = 'checkbox'
    inputTodoCheckBox.checked = todo.completed ? true : false;
    inputTodoCheckBox.addEventListener('change', () => {
      changeTodo(todo,'completed');
      liTodo.classList.toggle('completed');
    })

    const labelTodo = document.createElement('label')
    const labelText = document.createTextNode(`${todo.title}`)
    labelTodo.appendChild(labelText)
    labelTodo.addEventListener('dblclick', () => {
      liTodo.classList.add('editing')
      inputTodoEdit.focus()
      inputTodoEdit.addEventListener('keyup', (event) => {
        if (event.key == "Enter" && inputTodoEdit.value.trim().length !== 0) {
          const indexTodo = allTodos.findIndex(element => element.id == todo.id)
          allTodos[indexTodo].title = inputTodoEdit.value.trim()
          allTodos[indexTodo].id = inputTodoEdit.value.trim()
          localStorage.setItem('mydayapp-js', JSON.stringify(allTodos))
          navigationPage()
        } else if (event.key === "Escape"){
          navigationPage()
        }

      })

    })

    const buttonTodo = document.createElement('button')
    buttonTodo.classList.add('destroy')
    buttonTodo.addEventListener('click', () => {
      changeTodo(todo,'delete')
    })

    const inputTodoEdit = document.createElement('input')
    inputTodoEdit.classList.add('edit')
    inputTodoEdit.value = `${todo.title}`

    divTodo.appendChild(inputTodoCheckBox)
    divTodo.appendChild(labelTodo)
    divTodo.appendChild(buttonTodo)

    liTodo.appendChild(divTodo)
    liTodo.appendChild(inputTodoEdit)

    ulTodoList.appendChild(liTodo)

  });
}

//funcion para completar o eliminar
function changeTodo(todo, action) {
  const indexTodo = allTodos.findIndex(element => element.id == todo.id)
  if (action === 'delete') {
    allTodos.splice(indexTodo, 1)
  } else if (action === 'completed'){
    allTodos[indexTodo].completed = allTodos[indexTodo].completed ? false : true;
  }
  localStorage.setItem('mydayapp-js', JSON.stringify(allTodos))
  navigationPage()
}

//funcion para calcular el numero de items
function totalItems() {
  todoCountSapn.innerHTML = ''
  let todoSpanText = document.createTextNode(' items left')
  const strongCount = document.createElement('strong')
  strongCount.innerHTML= pendingTodos.length

  if (allTodos.length == 0) {
    mainTodos.classList.add('inactive')
    footerTodos.classList.add('inactive')

  } else if (pendingTodos.length == 1) {
    mainTodos.classList.remove('inactive')
    footerTodos.classList.remove('inactive')
    todoSpanText = document.createTextNode(' item left')

  } else if (pendingTodos.length > 1) {
    mainTodos.classList.remove('inactive')
    footerTodos.classList.remove('inactive')

  }
  todoCountSapn.appendChild(strongCount)
  todoCountSapn.appendChild(todoSpanText)
}

