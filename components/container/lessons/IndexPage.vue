<template>
  <page-wrapper>
    <app-bar
      :title="appbar.title"
      :user="user"
      :navMenuItems="appbar.navMenuItems"
    />

    <scroll-box>
      <v-card-title
        class="primary--text font-weight-bold px-6"
        v-text="'取り組み中のレッスン'"
      />

      <lessons-list :lessons="openedLessons" />

      <v-card-title
        class="primary--text font-weight-bold px-6"
        v-text="'レッスン一覧'"
      />

      <lessons-list :lessons="lessons" />
    </scroll-box>
  </page-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
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
      appbar: {
        title: 'progree',
        navMenuItems: [
          {
            icon: 'logout',
            text: 'ログアウト',
            location: '/logout/'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['lessons', 'openedLessons'])
  }
}
</script>
