<template>
  <admin-lesson-create-page />
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
    // レッスン取得
    await context.store.dispatch('data/fetchLessons')
  },
  head () {
    return {
      title: 'レッスン作成・編集 | progree'
    }
  }
}
</script>
