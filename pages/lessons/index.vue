<template>
  <index-page />
</template>

<script>
import IndexPage from '~/components/container/lessons/IndexPage'
export default {
  components: { IndexPage },
  async middleware (context) {
    // 認証確認
    if (!context.store.getters['auth/isAuthenticated']) {
      return context.redirect({ path: '/login/', query: { next: context.route.path } })
    }
    // レッスン取得
    await context.store.dispatch('data/fetchLessons')
    // 進捗取得
    await context.store.dispatch('data/fetchProgress')
  },
  head () {
    return {
      title: 'ホーム'
    }
  }
}
</script>
