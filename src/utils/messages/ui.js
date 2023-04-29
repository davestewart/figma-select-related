const handlers = {}

window.addEventListener('message', function ({ data: { pluginMessage: data } }) {
  const { type, ...values } = data
  const handler = handlers[type]
  if (handler) {
    handler(values)
  }
})

function handleMessage (type, handler) {
  if (type && typeof type === 'object') {
    Object.assign(handlers, type)
  }
  else {
    handlers[type] = handler
  }
}

function postMessage (type, values = {}) {
  parent.postMessage({ pluginMessage: { type, ...values } }, '*')
}

export {
  handleMessage,
  postMessage,
}
