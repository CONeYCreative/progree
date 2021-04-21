<template>
  <page-wrapper>
    <app-bar
      :title="text.progree"
      :user="user"
      :navMenuItems="navMenuItems"
    />

    <scroll-box>
      <v-card-title
        class="primary--text font-weight-bold px-6"
        v-text="text.recent"
      />

      <lessons-list
        :lessons="openedLessons"
        :progress="progress"
        close
        @click:start="$router.push({ path: `/lessons/${$event.id}/` })"
        @click:close="closeLesson($event)"
      />

      <v-card-title
        class="primary--text font-weight-bold px-6"
        v-text="text.list"
      />

      <lessons-list
        :lessons="lessons.filter(lesson => lesson.rank < 999)"
        :progress="progress"
        @click:start="$router.push({ path: `/lessons/${$event.id}/` })"
      />
    </scroll-box>
  </page-wrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PageWrapper from '~/components/presentational/PageWrapper'
import AppBar from '~/components/presentational/AppBar'
import ScrollBox from '~/components/presentational/ScrollBox'
import LessonsList from '~/components/presentational/LessonsList'
export default {
  components: {
    PageWrapper,
    AppBar,
    ScrollBox,
    LessonsList
  },
  data () {
    return {
      text: {
        progree: 'progree',
        recent: '最近のレッスン',
        list: 'レッスン一覧'
      },
      navMenuItems: [
        {
          icon: 'logout',
          text: 'ログアウト',
          location: '/logout/'
        }
      ]
    }
  },
  fetch () {
    if (this.user.isAdmin) {
      this.navMenuItems.push({
        icon: 'person',
        text: '管理者ページ',
        location: '/admin/'
      })
    }
  },
  methods: {
    async closeLesson (lesson) {
      await this.setProgress({
        id: lesson.id,
        merge: true,
        isOpen: false,
        isDoing: true
      })
    },
    ...mapActions('data', ['setProgress'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['lessons', 'progress', 'openedLessons'])
  }
}
</script>
