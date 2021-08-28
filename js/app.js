const app = new Vue({
  el: '#app',
  data: {
    title: 'Todo app',
    todo: '',
    timeAdd: '',
    timeFin: '',
    todoArray: typeof (Storage) !== 'undefined' ? JSON.parse(window.localStorage.getItem('todo-app')) || [] : []
  },
  methods: {
    addTodo () {
      if (this.todo.trim().length > 0) {
        this.todoArray.push({
          title: this.todo,
          done: false,
          timeAdd: this.setTime()
        })
        this.todo = ''
        this.addToLocalStorage()
      }
    },
    removeTodo (index, elem) {
      this.todoArray.splice(index, 1)
      this.addToLocalStorage(index, elem)
    },
    allDone () {
      this.todoArray.forEach(todo => {
        todo.done = true
        todo.timeFin = this.setTime()
      })
      typeof (Storage) !== 'undefined' && window.localStorage.setItem('todo-app', JSON.stringify(this.todoArray))
    },
    allDFalse () {
      this.todoArray.forEach(todo => {
        todo.done = false
        todo.timeFin = ''
      })
      typeof (Storage) !== 'undefined' && window.localStorage.setItem('todo-app', JSON.stringify(this.todoArray))
    },
    counter () {
      return this.todoArray.filter(todo => {
        return todo.done === false
      }).length
    },
    addToLocalStorage (index, elem) {
      // if array exist (not deleted) set done at first
      if (this.todoArray[index]) {
        this.todoArray[index].done = elem.target.checked
        this.todoArray[index].timeFin = this.todoArray[index].done ? this.setTime() : ''
      }
      // rewrite all local storage
      typeof (Storage) !== 'undefined' && window.localStorage.setItem('todo-app', JSON.stringify(this.todoArray))
    },
    setTime () {
      return new Date().toLocaleString('en-US', {
        hour12: false
      })
    }
  }
})
