<template>
  <lesson-create-page />
</template>

<script>
import LessonCreatePage from '~/components/container/admin/LessonCreatePage'
export default {
  components: { LessonCreatePage },
  async middleware (context) {
    // 認証確認
    if (!context.store.getters['auth/isAuthenticated']) {
      return context.redirect({ path: '/login/', query: { next: context.route.path } })
    }
    // レッスン取得
    await context.store.dispatch('data/fetchLessons')
  },
  head () {
    return {
      title: 'レッスン作成'
    }
  }
}
</script>
