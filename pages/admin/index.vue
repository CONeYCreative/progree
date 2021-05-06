<template>
  <admin-index-page />
</template>

<script>
export default {
  async middleware (context) {
    // 認証確認
    const user = context.store.getters['auth/user']
    if (!user?.uid) {
      context.redirect({
        path: '/login/',
        query: {
          next: context.route.path
        }
      })
      return
    }
    if (!user?.isAdmin) {
      context.redirect({
        path: '/'
      })
      return
    }
  },
  head () {
    return {
      title: '管理者ページ | progree'
    }
  }
}
</script>
