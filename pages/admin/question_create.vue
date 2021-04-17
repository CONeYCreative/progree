<template>
  <question-create-page />
</template>

<script>
import QuestionCreatePage from '~/components/container/admin/QuestionCreatePage'
export default {
  components: { QuestionCreatePage },
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
      title: '問題作成・編集'
    }
  }
}
</script>
