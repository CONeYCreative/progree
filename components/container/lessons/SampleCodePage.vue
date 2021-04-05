<template>
  <lesson-page
    :title-icon="icons.sampleCode"
    :title-text="text.sampleCode"
    :prev-button-text="text.prev"
    :next-button-text="text.next"
    @click:prev="$router.push({ path: `/lessons/${lesson.id}/` })"
    @click:next="$router.push({ path: `/lessons/${lesson.id}/exercise/` })"
  >
    <editor-box
      :code="lesson.sample.code"
      :description="lesson.sample.description"
    />
  </lesson-page>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonPage from '~/components/container/lessons/LessonPage'
import EditorBox from '~/components/presentational/EditorBox'
export default {
  components: {
    LessonPage,
    EditorBox
  },
  data () {
    return {
      lesson: null,
      icons: { sampleCode: 'code' },
      text: {
        sampleCode: 'コードを書いてみよう',
        prev: 'スライドに戻る',
        next: 'Exerciseへ'
      }
    }
  },
  fetch () {
    const lessonId = this.$route.params.lessonId
    this.lesson = this.$store.getters['data/theLesson'](lessonId)
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['theLesson'])
  }
}
</script>
