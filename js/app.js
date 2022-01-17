/* eslint-disable no-new */
const divInstall = document.getElementById('installContainer')
const butInstall = document.getElementById('butInstall')

/* Put code here */
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile.
  event.preventDefault()
  console.log('👍', 'beforeinstallprompt', event)
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event
  // Remove the 'hidden' class from the install button container.
  divInstall.classList.toggle('hidden', false)
})

butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked')
  const promptEvent = window.deferredPrompt
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return
  }
  // Show the install prompt.
  promptEvent.prompt()
  // Log the result
  const result = await promptEvent.userChoice
  console.log('👍', 'userChoice', result)
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null
  // Hide the install button.
  divInstall.classList.toggle('hidden', true)
})
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event)
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null
})
/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}

/**
 * Warn the page must be served over HTTPS
 * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
 * Installability requires a service worker with a fetch event handler, and
 * if the page isn't served over HTTPS, the service worker won't load.
 */
if (window.location.protocol === 'http:') {
  const requireHTTPS = document.getElementById('requireHTTPS')
  const link = requireHTTPS.querySelector('a')
  link.href = window.location.href.replace('http://', 'https://')
  requireHTTPS.classList.remove('hidden')
}

butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked')
  const promptEvent = window.deferredPrompt
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return
  }
  // Show the install prompt.
  promptEvent.prompt()
  // Log the result
  const result = await promptEvent.userChoice
  console.log('👍', 'userChoice', result)
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null
  // Hide the install button.
  divInstall.classList.toggle('hidden', true)
})
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event)
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null
})
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
          todo: this.todo.replace(/,/g, '.').trim(),
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
      // push only numbers to array
      this.todoArray.forEach(e => {
        if (typeof e.todo !== 'undefined' && !e.done && !isNaN(parseFloat(e.todo.match(/[+-]?((?=\.?\d)\d*\.?\d*)/g)))) {
          numArray.push(parseFloat(e.todo.match(/[+-]?((?=\.?\d)\d*\.?\d*)/g)))
        }
      })
      // return sum of numbers
      return numArray.reduce((a, b) => {
        const n1 = a.toString().split('.')[1]
        const n2 = b.toString().split('.')[1]
        const len1 = (n1 && n1.length) || 0
        const len2 = (n2 && n2.length) || 0
        return parseFloat((a + b).toFixed(len1 + len2))
      }, 0)
    }
  }
})
