export const catchError = (func, metthodName, defaultValue) => {
  try {
    return func()
  } catch (err) {
    console.log(`${metthodName}: ${err}`)
  }
  return defaultValue
}