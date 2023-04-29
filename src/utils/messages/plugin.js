const handlers = {}

figma.ui.onmessage = function (msg) {
  const { type, ...values } = msg
  const handler = handlers[type]
  if (handler) {
    handler(values)
  }
}

function handleMessage (type, handler) {
  if (type && typeof type === 'object') {
    Object.assign(handlers, type)
  }
  else {
    handlers[type] = handler
  }
}

function postMessage (type, values = {}) {
  figma.ui.postMessage({ type, ...values })
}

export {
  handleMessage,
  postMessage,
}
