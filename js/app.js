/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    lang: 'lt',
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
      return this.todoArray.filter(todo => todo.done === false).length
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
      const options = { hour: '2-digit', minute: '2-digit', hour12: false }
      return (new Date()).toLocaleDateString(this.lang, options)
    },
    counterNumbers () {
      const numArray = []
      this.todoArray.forEach(todo => {
        if (!isNaN(parseFloat(todo.title.replace(/[^\d\.]*/, '')))) {
          numArray.push(parseFloat(todo.title.replace(/[^\d\.]*/, '')))
        }
      })
      return numArray.reduce((a, b) => {
        const n1 = a.toString().split('.')[1]
        const n2 = b.toString().split('.')[1]
        const len1 = (n1 && n1.length) || 0
        const len2 = (n2 && n2.length) || 0
        const num = a + b
        return parseFloat(num.toFixed(len1 + len2))
      }, 0)
    }
  }
})
