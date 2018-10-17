import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
window.addEventListener('beforeunload', function(event) {
  event.returnValue = 'Are you sure?'
})
ReactDOM.render(<App generateKeysIsDisabled={true} />, document.getElementById('root'))
registerServiceWorker()
