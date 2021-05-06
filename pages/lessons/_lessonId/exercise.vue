<template>
  <lessons-lesson-page
    v-if="!loading"
    :lesson="lesson"
    :progress="progresses"
    :title-icon="exerciseIcon"
    :title-text="text.title"
    :prev-button-text="text.prev"
    :next-button-text="text.next"
    :next-button-disabled="!isClear"
    @click:prev="$router.push(prevPath)"
    @click:next="$router.push(`/lessons/${lesson.nextLessonId}/slide/`)"
  >
    <lessons-exercise-wrapper
      :exercise="exercise"
      :progress="progress"
      :progresses="progresses"
      @next="fetchExercise"
      @clear="$router.push(`/lessons/${lesson.nextLessonId}/slide/`)"
    />
  </lessons-lesson-page>
</template>

<script>
import { mapGetters } from 'vuex'
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
    // エクササイズがない場合
    if (!Object.keys(lesson.exercises).length) {
      context.redirect('/')
    }
    // プログレスの取得
    await context.store.dispatch('data/fetchProgress')
    const progresses = context.store.getters['data/theProgress'](lessonId)
    return {
      lessonId,
      lesson,
      progresses,
      loading: false,
      isClear: false,
      progress: null,
      exercise: null,
      prevPath: null,
      exerciseIcon: 'mdi-head-lightbulb',
      text: {
        title: null,
        prev: null,
        next: '次のレッスンへ'
      }
    }
  },
  created () {
    // 前へ
    if (this.lesson.sample.description) {
      // サンプルコードがある場合
      this.prevPath = `/lessons/${this.lesson.id}/code/`
      this.text.prev = 'サンプルコードに戻る'
    } else if (this.lesson.slides?.length) {
      // スライドがある場合
      this.prevPath = `/lessons/${this.lesson.id}/slide/`
      this.text.prev = 'スライドに戻る'
    } else {
      // サンプルコードもスライドもない場合
      this.prevPath = `/lessons/${this.lesson.prevLessonId}/slide/`
      this.text.prev = '前のレッスンへ'
    }
    // 挑戦すべきエクササイズを取得
    this.fetchExercise()
  },
  head () {
    return {
      title: `エクササイズ | ${this.lesson.title} | progree`
    }
  },
  methods: {
    async fetchExercise () {
      this.loading = true
      this.progresses = this.theProgress(this.lessonId)
      // エクササイズの取得
      const exerciseIds = Object.keys(this.lesson.exercises).sort()
      // 挑戦すべきエクササイズを探す
      for (const exerciseId of exerciseIds) {
        const exercise = this.lesson.exercises[exerciseId] || {}
        const progress = this.progresses.exercises[exerciseId] || { clearedIds: [] }
        // そのエクササイズの通算正解数がノルマより低ければ決定
        if (progress.clearedIds.length < exercise.quota) {
          this.exercise = {
            id: exerciseId,
            isFinal: exerciseId === exerciseIds.slice(-1)[0],
            ...exercise
          }
          this.text.title = `Exercise ${exerciseId.replace('exercise', '')}`
          this.progress = {
            next: 2,
            answeredIds: [],
            clearedIds: [],
            ...progress
          }
          this.isClear = progress.isClear
          break
        }
      }
      await new Promise(resolve => setTimeout(resolve, 400))
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('data', ['theProgress'])
  }
}
</script>
