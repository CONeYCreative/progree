<template>
  <slide-page />
</template>

<script>
import { mapGetters } from 'vuex'
import SlidePage from '~/components/container/lessons/SlidePage'
export default {
  components: { SlidePage },
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
  data () {
    return {
      lesson: null
    }
  },
  created () {
    const lessonId = this.$route.params.lessonId
    this.lesson = this.theLesson(lessonId)
  },
  head () {
    return {
      title: `${this.lesson.title}`
    }
  },
  computed: {
    ...mapGetters('data', ['theLesson'])
  }
}
</script>

