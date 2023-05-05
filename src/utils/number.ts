/**
 * Check if a value is number-like
 */
export function isNumeric (value) {
  return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)
}

/**
 * Clamp a number between lower and upper bounds
 */
export function clamp (value: number, length: number | any[]) {
  const min = 0
  const max = Array.isArray(length) ? length.length : length
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

/**
 * Wrap a number at lower and upper bounds
 */
export function wrap (value: number, length: number | any[]) {
  const min = 0
  const max = Array.isArray(length) ? length.length : length
  if (value < min) {
    return max - 1
  }
  if (value >= max) {
    return min
  }
  return value
}
