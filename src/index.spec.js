import adapter from './index'
import { deepEqual, equal, ok } from 'assert'

const getStorageStub = (storage) => ({
  getItem: function self (key) { self.key = key; return storage && storage[key] },
  setItem: function self (key, value) { self[key] = value },
  removeItem: function self (key) { self.key = key }
})
const getWindowStub = () => ({
  addEventListener: function self (name, listener) { self[name] = listener },
  removeEventListener: function self (name, listener) { self[name] = listener }
})

describe('react-entanglement-web-storage-adapter', () => {
  describe('scatterer', () => {
    describe('unmount', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('app', storageStub, windowStub)

      it('removes the render of the component', () => {
        theAdapter.scatterer.unmount('component')

        equal(storageStub.removeItem.key, 'app:render:component')
      })
    })

    describe('render', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('other-app', storageStub, windowStub)

      it('sets the data and handlerNames for the component', () => {
        const data = { the: 'data' }
        const handlerNames = { the: 'handlerNames' }
        theAdapter.scatterer.render('component', data, handlerNames)

        deepEqual(
          JSON.parse(storageStub.setItem['other-app:render:component']),
          { data, handlerNames }
        )
      })
    })

    describe('addHandlerListener', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('app', storageStub, windowStub)
      const handler = function self (args) { self.args = args }

      const deListener = theAdapter.scatterer.addHandlerListener('component', 'onTouch', handler)

      it('sets up a listener', () => {
        ok(typeof windowStub.addEventListener['storage'] === 'function')
      })

      it('returns a function to unset the listener', () => {
        equal(windowStub.removeEventListener['storage'], undefined)

        deListener()
        equal(
          windowStub.removeEventListener['storage'],
          windowStub.addEventListener['storage']
        )
      })

      describe('listener', () => {
        describe('if key matches component handle, the handlerName and there is data in storage for it', () => {
          it('runs the callback with the args from the event data', () => {
            const listener = windowStub.addEventListener['storage']

            listener({
              key: 'app:handle:component:onTouch',
              newValue: JSON.stringify({
                args: { the: 'args' }
              })
            })

            deepEqual(handler.args, { the: 'args' })
          })
        })
      })
    })
  })

  describe('materializer', () => {
    describe('addUnmountListener', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('app', storageStub, windowStub)
      const handler = function self () { self.called = true }

      const deListener = theAdapter.materializer.addUnmountListener('component', handler)

      it('sets up a listener', () => {
        ok(typeof windowStub.addEventListener['storage'] === 'function')
      })

      it('returns a function to unset the listener', () => {
        equal(windowStub.removeEventListener['storage'], undefined)

        deListener()

        equal(
          windowStub.removeEventListener['storage'],
          windowStub.addEventListener['storage']
        )
      })

      describe('listener', () => {
        describe('if key matches component render and there is no value in storage for it', () => {
          it('runs the callback', () => {
            const listener = windowStub.addEventListener['storage']

            listener({
              key: 'app:render:component',
              newValue: null
            })

            ok(handler.called)
          })
        })
      })
    })

    describe('addRenderListener', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('app', storageStub, windowStub)
      const handler = function self (data, handlerNames) {
        self.data = data
        self.handlerNames = handlerNames
      }

      const deListener = theAdapter.materializer.addRenderListener('component', handler)

      it('sets up a listener', () => {
        ok(typeof windowStub.addEventListener['storage'] === 'function')
      })

      it('returns a function to unset the listener', () => {
        equal(windowStub.removeEventListener['storage'], undefined)

        deListener()

        equal(
          windowStub.removeEventListener['storage'],
          windowStub.addEventListener['storage']
        )
      })

      describe('if there is a record for rendering this component in storage', () => {
        const storageStub = getStorageStub({
          'app:render:component': JSON.stringify({
            data: { the: 'data' },
            handlerNames: { the: 'handlerNames' }
          })
        })
        const windowStub = getWindowStub()
        const theAdapter = adapter('app', storageStub, windowStub)
        const handler = function self (data, handlerNames) {
          self.data = data
          self.handlerNames = handlerNames
        }

        theAdapter.materializer.addRenderListener('component', handler)

        it('runs the callback with data and handlerNames from storage', () => {
          deepEqual(handler.data, { the: 'data' })
          deepEqual(handler.handlerNames, { the: 'handlerNames' })
        })
      })

      describe('listener', () => {
        describe('if key matches component render and there is data in the event for it', () => {
          it('runs the callback with data and handlerNames from the event', () => {
            const listener = windowStub.addEventListener['storage']

            listener({
              key: 'app:render:component',
              newValue: JSON.stringify({
                data: { the: 'data' },
                handlerNames: { the: 'handlerNames' }
              })
            })

            deepEqual(handler.data, { the: 'data' })
            deepEqual(handler.handlerNames, { the: 'handlerNames' })
          })
        })
      })
    })

    describe('handle', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('other-app', storageStub, windowStub)

      it('sets the storage for the component with handle and the handlerName as key and the args and current timestamp as values', () => {
        const args = { the: 'args' }
        const timestamp = (new Date()).getTime()
        theAdapter.materializer.handle('new-component', 'onTouch', args)

        const parsedData = JSON.parse(storageStub.setItem['other-app:handle:new-component:onTouch'])

        deepEqual(parsedData.args, args)
        ok(parsedData.time > timestamp - 5 && parsedData.time < timestamp + 5)
      })
    })
  })
})
