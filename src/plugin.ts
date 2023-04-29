import { handleMessage, postMessage } from './utils/messages/plugin'
import { isNumeric, loop, toArray } from './utils/general'
import { getSelection, setSelection } from './utils/selection'
import { isNode, isRoot } from './utils/assert'

// ---------------------------------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------------------------------

function getByPath (path: string | Array<string | number>, source: BaseNode = null, parent: BaseNode = null) {
  const names = Array.isArray(path)
    ? [...path]
    : path.split('|')
  if (source === null) {
    source = getSelection(true)
    if (!source) {
      console.warn('No selection!')
      return []
    }
  }
  if (parent === null) {
    names.unshift('')
  }
  const items: BaseNode[] = []
  const [target, ...targets] = names
  if (targets.length === 0) {
    if (source.name === target) {
      return [source]
    }
  }
  else if(source && 'children' in source) {
    if (targets.length === 1 && isNumeric(targets[0])) {
      items.push(source.children[Number(targets[0])])
    }
    else {
      for (let child of source.children) {
        items.push(...getByPath(targets, child, source))
      }
    }
  }
  return items
}

function getRelated (source: BaseNode) {
  let target: BaseNode | undefined = source
  let ids = []
  let items = []
  let found = false
  if (isRoot(target.parent)) {
    return items
  }
  while (target?.parent && !found) {
    const id = ids.length
      ? target.name
      : target.parent.children.indexOf(target as SceneNode)
    ids.unshift(id)
    target = target?.parent
    items = getByPath([...ids], target)
    found = items.filter(item => item !== source).length > 0
  }
  return items.filter(e => e)
}

// ---------------------------------------------------------------------------------------------------------------------
// plugin
// ---------------------------------------------------------------------------------------------------------------------

type Action = 'number'| 'first'| 'last'| 'prev'| 'next' | 'parent' | 'children'

function filterItems (items: SceneNode[], action: Action, source: SceneNode = undefined) {
  source = source || items[0]
  if (typeof action === 'number') {
    return items[action]
  }
  else if (action === 'first') {
    return items[0]
  }
  else if (action === 'last') {
    return items[items.length - 1]
  }
  else if (action === 'prev' || action === 'next') {
    const dir = action === 'prev' ? -1 : 1
    const index = items.indexOf(source) + dir
    return items[loop(index, items)]
  }
  else {
    return items
  }
}

function selectItems (action: Action = undefined) {
  const source = getSelection(true)
  if (source) {
    let targets: BaseNode[] = toArray(source)
    if (action === 'parent') {
      targets = source.parent
        ? [source.parent]
        : [source]
    }
    else if (action === 'children') {
      if ('children' in source && source.children.every(isNode)) {
        targets = source.children as BaseNode[] || []
      }
    }
    else {
      const related = getRelated(source)
      if (related.length) {
        targets = toArray(filterItems(related, action, source))
      }
      else {
        const items = source.parent ? source.parent.children : []
        targets = toArray(filterItems(items as SceneNode[], action, source))
      }
    }
    if (targets.length) {
      setSelection(targets)
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function onSelection () {
  try {
    const selection = getSelection()
    let message = 'No items selected'
    if (selection.length) {
      message = selection.length > 1
        ? `Selected ${selection.length} items`
        : `Selected "${selection[0].name}"`
    }
    postMessage('result', { message })
  }
  catch(err) {
    // nothing
  }
}

figma.on('selectionchange', onSelection)

figma.skipInvisibleInstanceChildren = true

// ---------------------------------------------------------------------------------------------------------------------
// start
// ---------------------------------------------------------------------------------------------------------------------

if (figma.command === 'open' || !figma.command) {
  figma.showUI(__html__, {
    themeColors: true,
    width: 260,
    height: 105
  })
  onSelection()
  handleMessage({
    select({ action }) {
      selectItems(action)
    },
    cancel () {
      figma.off('selectionchange', onSelection)
      figma.closePlugin()
    },
  })
}
else {
  if (figma.command) {
    selectItems(figma.command as Action)
  }
  figma.closePlugin()
}
