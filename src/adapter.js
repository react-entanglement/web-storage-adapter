export default (prefix, storage = window.localStorage, w = window) => {
  const key = (action, name) => `${prefix}:${action}:${name}`
  const get = storage.getItem.bind(storage)
  const set = (key, data) => storage.setItem(key, JSON.stringify(data))
  const remove = storage.removeItem.bind(storage)
  const on = w.addEventListener.bind(w, 'storage')
  const off = w.removeEventListener.bind(w, 'storage')

  return {
    // <Scatter>
    unmount: (componentName) => remove(key('render', componentName)),

    render: (componentName, data, handlerNames) => set(
      key('render', componentName),
      { data, handlerNames }
    ),

    onHandle: (componentName, handlerName, callback) => {
      const listener = (e) =>
        e.key === key('handle', `${componentName}:${handlerName}`) &&
        e.newValue != null &&
        callback(JSON.parse(e.newValue).args)

      on(listener)
      return () => off(listener)
    },
    // </Scatter>

    // <Materialize>
    onUnmount: (componentName, callback) => {
      const listener = (e) =>
        e.key === key('render', componentName) &&
        e.newValue == null &&
        callback()

      on(listener)
      return () => off(listener)
    },

    onRender: (componentName, callback) => {
      // First load, show if necessary
      if (get(key('render', componentName)) != null) {
        const { data, handlerNames } = JSON.parse(
          get(key('render', componentName))
        )

        callback(data, handlerNames)
      }

      const listener = (e) => {
        if (
          e.key === key('render', componentName) &&
          e.newValue != null
        ) {
          const { data, handlerNames } = JSON.parse(e.newValue)

          callback(data, handlerNames)
        }
      }

      on(listener)
      return () => off(listener)
    },

    handle: (componentName, handlerName, args) =>
      set(key('handle', `${componentName}:${handlerName}`), {
        args,
        time: new Date().getTime()
      })
    // </Materialize>
  }
}
