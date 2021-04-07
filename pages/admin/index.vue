<template>
  <index-page />
</template>

<script>
import IndexPage from '~/components/container/admin/IndexPage'
export default {
  components: { IndexPage },
  async middleware (context) {
    // 認証確認
    const user = context.store.getters['auth/user']
    if (!user?.uid) {
      return context.redirect({ path: '/login/', query: { next: context.route.path } })
    }
    if (!user?.isAdmin) {
      return context.redirect({ path: '/' })
    }
  },
  head () {
    return {
      title: '管理者ページ'
    }
  }
}
</script>
