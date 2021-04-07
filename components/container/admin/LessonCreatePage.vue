<template>
  <page-wrapper>
    <app-bar
      :title="text.progree"
      :user="user"
      :navMenuItems="navMenuItems"
    />

    <scroll-box>
      <div>
        <v-icon
          class="mx-3"
          color="accent"
          v-text="icons.edit"
        />
        <v-card-title
          class="primary--text font-weight-bold px-6"
          v-text="text.title"
        />
      </div>
    </scroll-box>

    <v-dialog v-model="dialogs.selectLesson">
      <v-card
        class="pa-6"
        color="#fffc"
      >
        <v-card-title
          class="secondary--text font-weight-bold px-6"
          v-text="text.selectLesson"
        />

        <lessons-list
          :lessons="lessons"
          simple
          create
        />
      </v-card>
    </v-dialog>
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
      lesson: null,
      icons: {
        edit: 'edit'
      },
      text: {
        progree: 'progree',
        title: 'レッスン作成・編集',
        selectLesson: '編集するレッスンを選択または作成'
      },
      dialogs: {
        selectLesson: true
      },
      form: {
        id: null,
        title: null,
        rank: null,
        nextLessonId: null,
        prevLessonId: null,
        sample: {
          code: null,
          description: null
        },
        nextLessonId: null,
        slides: [],
        exercises: {}
      },
      navMenuItems: [
        {
          icon: 'home',
          text: 'ホーム',
          location: '/'
        },
        {
          icon: 'logout',
          text: 'ログアウト',
          location: '/logout/'
        },
        {
          icon: 'person',
          text: '管理者ページ',
          location: '/admin/'
        },
      ]
    }
  },
  fetch () {
    // レッスン一覧取得
  },
  methods: {
    selectLesson (lesson = {}) {
      this.lesson = lesson
      this.lesson.id = this.lesson.id || this.$uuid()
      this.form = { ...this.form, ...this.lesson }
      this.dialogs.selectLesson = false
    },
    submit () {

    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['lessons'])
  }
}
</script>
