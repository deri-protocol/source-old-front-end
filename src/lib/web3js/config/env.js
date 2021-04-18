//export const DERI_ENV="dev"
export const DeriEnv = (() => {
  let _deriEnv = "dev"
  return {
    get: () => {
      return _deriEnv
    },
    set: (value) => {
      if (value === "dev" || value === "prod" || value === "production" ) {
        _deriEnv = value
      } else {
        throw new Error("please use 'dev' or 'prod' for DeriEnv")
      }
    }
  }
})()