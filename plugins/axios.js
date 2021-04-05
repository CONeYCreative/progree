export default (context) => {
  context.$axios.defaults.timeout = 10000
  context.$axios.onRequest(config => { config.headers.common['Content-Type'] = 'application/json' })
  context.$axios.onResponse(response => Promise.resolve(response))
  context.$axios.onError(error => Promise.reject({ isError: true, ...error }))
}
