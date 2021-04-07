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
          class="d-flex justify-center align-center"
          color="primary"
          height="90"
          width="280"
          dark
          @click="$router.push({ path: item.path })"
        >
          <v-icon
            class="mx-3"
            v-text="icons.edit"
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
import AppBar from '~/components/presentational/AppBar'
import ScrollBox from '~/components/presentational/ScrollBox'
export default {
  components: {
    PageWrapper,
    AppBar,
    ScrollBox
  },
  data () {
    return {
      icons: {
        edit: 'edit'
      },
      text: {
        progree: 'progree',
        title: '管理者ページ'
      },
      mainItems: [
        {
          text: 'レッスン作成・編集',
          path: '/admin/lesson_create/'
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
