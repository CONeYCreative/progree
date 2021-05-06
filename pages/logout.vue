<script>
export default {
  async middleware (context) {
    const auth = context.store.getters['auth/isAuthenticated']
    if (auth) {
      await context.store.dispatch('auth/logout')
    }
    context.redirect({
      path: '/login/'
    })
  }
}
</script>
