export function isRoot (node: BaseNode) {
  return node.type === 'DOCUMENT'
    || node.type === 'PAGE'
}

export function isNode (node: BaseNode) {
  return node.type === 'COMPONENT'
    || node.type === 'COMPONENT_SET'
    || node.type === 'FRAME'
    || node.type === 'GROUP'
    || node.type === 'INSTANCE'
    || node.type === 'TEXT'
    || node.type === 'PAGE'
}

export function isShape (node: BaseNode) {
  return node.type === 'BOOLEAN_OPERATION'
    || node.type === 'ELLIPSE'
    || node.type === 'LINE'
    || node.type === 'POLYGON'
    || node.type === 'STAR'
    || node.type === 'VECTOR'
    || node.type === 'RECTANGLE'
}

export function isFigJam (node: BaseNode) {
  return node.type === 'CODE_BLOCK'
    || node.type === 'CONNECTOR'
    || node.type === 'EMBED'
    || node.type === 'HIGHLIGHT'
    || node.type === 'LINK_UNFURL'
    || node.type === 'MEDIA'
    || node.type === 'SECTION'
    || node.type === 'SHAPE_WITH_TEXT'
    || node.type === 'STAMP'
    || node.type === 'STICKY'
    || node.type === 'WASHI_TAPE'
    || node.type === 'WIDGET'
}

export function isOther (node: BaseNode) {
  return node.type === 'SLICE'
}
