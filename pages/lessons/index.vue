<template>
  <page-wrapper>
    <app-bar
      :title="text.progree"
      :user="user"
      :navMenuItems="navMenuItems.filter(item => !item.admin || user.isAdmin)"
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
        @click:start="$router.push(`/lessons/${$event.id}/slide/`)"
        @click:close="closeLesson($event)"
      />

      <v-card-title
        class="primary--text font-weight-bold px-6"
        v-text="text.list"
      />

      <lessons-list
        :lessons="lessons.filter(lesson => lesson.rank < 999)"
        :progress="progress"
        @click:start="$router.push(`/lessons/${$event.id}/slide/`)"
      />
    </scroll-box>
  </page-wrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
  head () {
    return {
      title: 'ホーム | progree'
    }
  },
  async asyncData (context) {
    // レッスンの取得
    await context.store.dispatch('data/fetchLessons')
    // プログレスの取得
    await context.store.dispatch('data/fetchProgress')
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
        },
        {
          icon: 'person',
          text: '管理者ページ',
          location: '/admin/',
          admin: true
        }
      ]
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
    ...mapGetters('data', [
      'lessons',
      'progress',
      'openedLessons'
    ])
  }
}
</script>
