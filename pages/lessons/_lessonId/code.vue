<template>
  <lessons-lesson-page
    :lesson="lesson"
    :progress="progresses"
    :title-icon="codeIcon"
    :title-text="text.sampleCode"
    :prev-button-text="text.prev"
    :next-button-text="text.next"
    @click:prev="$router.push(prevPath)"
    @click:next="$router.push(nextPath)"
  >
    <sample-code-box :lesson="lesson" />
  </lessons-lesson-page>
</template>

<script>
export default {
  async middleware (context) {
    // 認証確認
    if (!context.store.getters['auth/isAuthenticated']) {
      return context.redirect({
        path: '/login/',
        query: {
          next: context.route.fullPath
        }
      })
    }
  },
  async asyncData (context) {
    // レッスンの取得
    await context.store.dispatch('data/fetchLessons')
    const lessonId = context.params.lessonId
    const lesson = context.store.getters['data/theLesson'](lessonId)
    // サンプルコードがない場合
    if (!lesson.sample.description) {
      context.redirect('/')
    }
    // プログレスの取得
    await context.store.dispatch('data/fetchProgress')
    const progresses = context.store.getters['data/theProgress'](lessonId)
    return {
      lesson,
      progresses,
      nextPath: null,
      prevPath: null,
      codeIcon: 'code',
      text: {
        sampleCode: 'コードを書いてみよう',
        prev: null,
        next: null
      }
    }
  },
  created () {
    // 前へ
    if (this.lesson.slides?.length) {
      // スライドがある場合
      this.prevPath = `/lessons/${this.lesson.id}/slide/`
      this.text.prev = 'スライドに戻る'
    } else {
      // スライドがない場合
      this.prevPath = `/lessons/${this.lesson.prevLessonId}/slide/`
      this.text.prev = '前のレッスンへ'
    }
    // 次へ
    if (Object.keys(this.lesson.exercises).length) {
      // エクササイズがある場合
      this.nextPath = `/lessons/${this.lesson.id}/exercise/`
      this.text.next = 'エクササイズへ'
    } else {
      // エクササイズがない場合
      this.nextPath = `/lessons/${this.lesson.nextLessonId}/slide/`
      this.text.next = '次のレッスンへ'
    }
  },
  head () {
    return {
      title: `サンプルコード | ${this.lesson.title} | progree`
    }
  }
}
</script>
