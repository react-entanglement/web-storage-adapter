import adapter from './index'
import { deepEqual, equal, ok } from 'assert'

const getStorageStub = () => ({
  getItem: function self (key) { self.key = key },
  setItem: function self (key, value) { self[key] = value },
  removeItem: function self (key) { self.key = key }
})
const getWindowStub = () => ({
  addEventListener: function self (name, listener) { self[name] = listener },
  removeEventListener: function self (name, listener) { self[name] = listener }
})

describe('react-entanglement-web-storage-adapter', () => {
  describe('<Scatter>', () => {
    describe('unmount', () => {
      const storageStub = getStorageStub()
      const windowStub = getWindowStub()
      const theAdapter = adapter('app', storageStub, windowStub)

      it('removes the render of the component', () => {
        theAdapter.unmount('component')

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
        theAdapter.render('component', data, handlerNames)

        deepEqual(
          JSON.parse(storageStub.setItem['other-app:render:component']),
          { data, handlerNames }
        )
      })
    })

    describe('onHandle', () => {
      it('sets up a listener')

      it('returns a function to unset the listener')

      describe('listener', () => {
        describe('if key matches component handle, the handlerName and there is data in storage for it', () => {
          it('runs the callback with the args from the storage data')
        })
      })
    })
  })

  describe('<Materialize>', () => {
    describe('onUnmount', () => {
      it('sets up a listener')

      it('returns a function to unset the listener')

      describe('listener', () => {
        describe('if key matches component render and there is no value in storage for it', () => {
          it('runs the callback')
        })
      })
    })

    describe('onRender', () => {
      it('sets up a listener')

      it('returns a function to unset the listener')

      describe('if there is a record for rendering this component in storage', () => {
        it('runs the callback with data and handlerNames from storage')
      })

      describe('listener', () => {
        describe('if key matches component render and there is data in storage for it', () => {
          it('runs the callback with data and handlerNames from storage')
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
        theAdapter.handle('new-component', 'onTouch', args)

        const parsedData = JSON.parse(storageStub.setItem['other-app:handle:new-component:onTouch'])

        deepEqual(parsedData.args, args)
        ok(parsedData.time > timestamp - 5 && parsedData.time < timestamp + 5)
      })
    })
  })
})
