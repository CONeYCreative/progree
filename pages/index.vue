<script>
export default {
  async middleware (context) {
    const auth = context.store.getters['auth/isAuthenticated']
    context.redirect(auth ? '/lessons/' : '/login/')
  }
}
</script>
