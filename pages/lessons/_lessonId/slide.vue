<template>
  <lessons-lesson-page
    :lesson="lesson"
    :progress="progresses"
    :title-icon="flashIcon"
    :title-text="lesson.title"
    :prev-button-text="text.prev"
    :next-button-text="text.next"
    :prev-button-disabled="!lesson.prevLessonId"
    :next-button-disabled="model !== lesson.slides.length - 1"
    @click:prev="$router.push(`/lessons/${lesson.prevLessonId}/slide/`)"
    @click:next="$router.push(nextPath)"
  >
    <slide-box
      v-model="model"
      :lesson="lesson"
    />
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
    // スライドがない場合
    if (!lesson.slides?.length) {
      context.redirect('/')
    }
    // スライド番号の取得
    const model = Number(context.route.hash.replace('#slide', '')) || 0
    // プログレスの取得
    await context.store.dispatch('data/fetchProgress')
    const progresses = context.store.getters['data/theProgress'](lessonId)
    return {
      lesson,
      model,
      progresses,
      nextPath: null,
      flashIcon: 'flash_on',
      text: {
        prev: '前のレッスンへ',
        next: null
      }
    }
  },
  created () {
    // 次へ
    if (this.lesson.sample.description) {
      // サンプルコードがある場合
      this.nextPath = `/lessons/${this.lesson.id}/code/`
      this.text.next = 'サンプルコードへ'
    } else if (Object.keys(this.lesson.exercises).length) {
      // エクササイズがある場合
      this.nextPath = `/lessons/${this.lesson.id}/exercise/`
      this.text.next = 'エクササイズへ'
    } else {
      // サンプルコードもエクササイズもない場合
      this.nextPath = `/lessons/${this.lesson.nextLessonId}/slide/`
      this.text.next = '次のレッスンへ'
    }
  },
  head () {
    return {
      title: `スライド | ${this.lesson.title} | progree`
    }
  },
  watch: {
    $route (route) {
      this.model = Number(route.hash.replace('#slide', '')) || 0
    }
  }
}
</script>

