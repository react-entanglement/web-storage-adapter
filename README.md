# WebStorage adapter for React Entanglement
[![Build Status](https://travis-ci.org/react-entanglement/web-storage-adapter.svg)](https://travis-ci.org/react-entanglement/web-storage-adapter)
[![npm version](https://badge.fury.io/js/react-entanglement-web-storage-adapter.svg)](https://badge.fury.io/js/react-entanglement-web-storage-adapter)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Usage

Install with:

```
npm install --save react-entanglement-web-storage-adapter
```

Then use it with React Entanglement like:

```javascript
import webStorageAdapter from 'react-entanglement-web-storage-adapter'
import { Scatter } from 'react-entanglement'
import { render } from 'react-dom'

const adapter = webStorageAdapter('demoApp')

render(
  <Scatter
    name='Button'
    props={{ onClick: () => alert('Well, hello from the other side') }}
    adapter={adapter}
  />
)
```

Make sure to use the same first argument in both sides, since the WebStorage adapter uses the name that you pass in as a namespace for the storage records.

By default, WebStorage adapter uses `localStorage`, but you can provide another storage in the second argument if you want. For example:

```javascript
import webStorageAdapter = 'react-entanglement-web-storage-adapter'

const adapter = webStorageAdapter('demoApp', window.sessionStorage)
```

Any storage provider that has the methods `getItem`, `setItem` and `removeItem` is supported. Also, for testing purposes, you can pass a `window` reference as the third argument.

## How

WebStorage adapter uses the WebStorage API to communicate between frames loaded from the same [`origin`](https://en.wikipedia.org/wiki/Same-origin_policy). On render, unmount and handle, the adapter will write records with the format:

```
<app-namespace>:<action>:<component>[:<handler>]
```

where:

- `app-namespace` is the first argument to the `webStorageAdapter` function.
- `action` can be either `render` for when the `<Scatter>` component requests or unmount the remote component, or `handle` for when the `<Materialize>` component sends back information from a triggered callback.
- `component` is whatever was set as the `name` prop in the `<Scatter>` and `<Materialize>`.
- `handler` is the handler prop name (`onClick` for example)

If you inspect the storage resource that WebStorage adapter is using (`localStorage` by default) you should be able to see this information being set there.

## Known quirks

### Only works cross-frames

The WebStorage API allows for storage events to be captured in the `window` object with `window.addEventListener('storage', function () { ... })`. This is what WebStorage adapter is relying on for cross-frame communication.

`window.addEventListener('storage', ...)` listeners will however not be triggered in the same `window` that the `setItem` or `removeItem` is done. If you want to use React Entanglement in the same window, you'll need to use the bundled passthrough adapter or implement a variation of this one with polling instead.

### The persistence of materializations

Since `localStorage` information is by default persistent, a reload of the page will cause the information about rendered entangled components to remain. Trying to be helpful, WebStorage adapter will read the the information from `localStorage` on load and materialize the corresponding components. This was deemed the most expected behavior, but might lead to surprises when re opening a frame.

Currently no option is provided to disable this behavior. Please write an issue if you think it should be.

### Records for the calling of handlers need timestamps to be properly captured

The WebStorage API was not designed to be used as a communication channel, and the `window` will fail to notify the listeners when re setting the same value for the same key, so in order to make every `click` unique, WebStorage adapter adds the timestamp as part of the `handle` entry. For example, a click record could look like this:

```javascript
storage = {
  'app:handle:Button:onClick': '{"args":[],"time":1466375125520}'
}
```

### Doesn't matter what storage you write to, it will be picked up

The current implementation of the WebStorage adapter does not differentiate between storage sources, so if you are using `localStorage` and someone writes to `sessionStorage` with a key structure that a WebStorage adapter is actually listening for, it will be acted upon. This is probably a bug that should be fixed.

## License

ISC License
