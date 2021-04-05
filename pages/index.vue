<script>
export default {
  async middleware (context) {
    if (context.store.getters['auth/isAuthenticated']) {
      return context.redirect({ path: '/lessons/' })
    } else {
      return context.redirect({ path: '/login/' })
    }
  }
}
</script>
