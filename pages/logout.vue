<script>
export default {
  async middleware (context) {
    if (context.store.getters['auth/isAuthenticated']) {
      await context.store.dispatch('auth/logout')
    }
    return context.redirect({ path: '/login/' })
  }
}
</script>
