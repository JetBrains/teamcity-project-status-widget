export default function copyAndRemove(array, elementToRemove, eq = (a, b) => a === b) {
  const index = array.findIndex(it => eq(it, elementToRemove));
  if (index >= 0) {
    return [
      ...(index > 0 ? array.slice(0, index) : []),
      ...(index < array.length - 1 ? array.slice(index + 1) : [])
    ];
  } else {
    return array;
  }
}
