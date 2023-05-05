/**
 * Convert any value to an array
 */
export function toArray (value) {
  return value === undefined
    ? []
    : Array.isArray(value)
      ? value
      : [value]
}
