import { toArray } from './array'

/**
 * Get the current selection sorted by position
 */
export function getSelection (): SceneNode[]
export function getSelection (first: boolean): SceneNode
export function getSelection (first?: boolean) {
  const selection = Array.from(figma.currentPage.selection as any[] as LayoutMixin[])
    .filter(e => e)
    .sort((a, b) => a?.absoluteBoundingBox.x - b?.absoluteBoundingBox.x)
    .sort((a, b) => a?.absoluteBoundingBox.y - b?.absoluteBoundingBox.y) as SceneNode[]
  return first
    ? selection[0]
    : selection
}

/**
 * Set the selection
 */
export function setSelection (nodes) {
  try {
    return figma.currentPage.selection = toArray(nodes).filter(e => e)
  }
  catch (err) {
    // nothing
  }
}

