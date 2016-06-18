/* global localStorage */
const PREFIX = 'react-entanglement-web-storage-adapter/'

const key = (action, name) =>
  `${PREFIX}${action}:${name}`

const set = (action, name, data) =>
  localStorage.setItem(key(action, name), JSON.stringify(data))

const remove = (action, name) =>
  localStorage.removeItem(key(action, name))

const get = (action, name) =>
  localStorage.getItem(key(action, name))

const on = (callback) =>
  window.addEventListener('storage', callback)

const off = (callback) =>
  window.removeEventListener('storage', callback)

export default {
  // methods used by the scatter

  unmount: (componentName) =>
    remove('render', componentName),

  render: (componentName, data, handlerNames) =>
    set('render', componentName, { data, handlerNames }),

  onHandle: (componentName, handlerName, cb) => {
    const listener = (e) =>
      e.key === key('handle', `${componentName}:${handlerName}`) &&
      e.newValue != null &&
      cb(JSON.parse(e.newValue).args)

    on(listener)
    return () => off(listener)
  },

  // methods used by the materializer

  onUnmount: (componentName, cb) => {
    const listener = (e) =>
      e.key === key('render', componentName) &&
      e.newValue == null &&
      cb()

    on(listener)
    return () => off(listener)
  },

  onRender: (componentName, cb) => {
    // First load, show if necessary
    if (get('render', componentName) != null) {
      const { data, handlerNames } = JSON.parse(get('render', componentName))

      cb(data, handlerNames)
    }

    const listener = (e) => {
      if (
        e.key === key('render', componentName) &&
        e.newValue != null
      ) {
        const { data, handlerNames } = JSON.parse(e.newValue)

        cb(data, handlerNames)
      }
    }

    on(listener)
    return () => off(listener)
  },

  handle: (componentName, handlerName, args) =>
    set('handle', `${componentName}:${handlerName}`, {
      args,
      time: new Date().getTime()
    })
}
