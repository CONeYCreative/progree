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
        v-text="text.title"
      />

      <div class="d-flex flex-wrap pa-6">
        <v-card
          v-for="item of mainItems"
          :key="item.text"
          class="d-flex justify-center align-center mx-3"
          color="primary"
          height="90"
          width="280"
          dark
          @click="$router.push(item.path)"
        >
          <v-icon
            class="mx-3"
            v-text="item.icon"
          />
          <v-card-title
            class="font-weight-bold px-6"
            v-text="item.text"
          />
        </v-card>
      </div>
    </scroll-box>
  </page-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
import PageWrapper from '~/components/presentational/PageWrapper'
import ScrollBox from '~/components/presentational/ScrollBox'
export default {
  components: {
    PageWrapper,
    ScrollBox
  },
  data () {
    return {
      text: {
        progree: 'progree',
        title: '管理者ページ'
      },
      mainItems: [
        {
          text: 'レッスン作成・編集',
          path: '/admin/lesson_create/',
          icon: 'edit'
        },
        {
          text: '問題作成・編集',
          path: '/admin/question_create/',
          icon: 'edit'
        }
      ],
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
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>
