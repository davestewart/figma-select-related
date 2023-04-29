export function isNumeric (value) {
  return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)
}

export function toArray (value) {
  return value === undefined
    ? []
    : Array.isArray(value)
      ? value
      : [value]
}

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

export function loop (value: number, length: number | any[]) {
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
