<template>
  <lesson-page
    :title-icon="icons.slide"
    :title-text="lesson.title"
    :prev-button-text="text.prev"
    :next-button-text="text.next"
    :prev-button-disabled="!lesson.prevLessonId"
    :next-button-disabled="model.slide !== lesson.slides.length - 1"
    @click:prev="$router.push({ path: `/lessons/${lesson.prevLessonId}/` })"
    @click:next="$router.push({ path: nextPath })"
  >
    <slide-box
      :lesson="lesson"
      v-model="model.slide"
    />
  </lesson-page>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonPage from '~/components/container/lessons/LessonPage'
import SlideBox from '~/components/presentational/SlideBox'
export default {
  components: {
    LessonPage,
    SlideBox
  },
  data () {
    return {
      lesson: null,
      model: { slide: 0 },
      icons: { slide: 'flash_on' },
      text: {
        headIcon: 'flash_on',
        prev: '前のレッスンに戻る',
        next: 'サンプルコードへ'
      },
      nextPath: null
    }
  },
  fetch () {
    const lessonId = this.$route.params.lessonId
    this.lesson = this.$store.getters['data/theLesson'](lessonId)
    this.model.slide = Number(this.$route.hash.replace('#slide', '')) || 0
    this.nextPath = `/lessons/${this.lesson.id}/code/`
    if (!this.lesson.sample.code && !this.lesson.sample.description) {
      this.nextPath = `/lessons/${this.lesson.id}/exercise/`
      this.text.next = 'エキササイズへ'
      if (!Object.keys(this.lesson.exercises).length) {
        this.nextPath = `/lessons/${this.lesson.prevLessonId}/`
        this.text.next = '次のレッスンへ'
      }
    }
  },
  computed: {
    ...mapGetters('data', ['theLesson'])
  },
  watch: {
    $route (route) {
      this.model.slide = Number(route.hash.replace('#slide', '')) || 0
    }
  }
}
</script>
