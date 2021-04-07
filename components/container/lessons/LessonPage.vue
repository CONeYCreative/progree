<template>
  <page-wrapper>
    <app-bar
      :title="text.title"
      :user="user"
      :navMenuItems="navMenuItems"
    />

    <v-card
      class="mx-3 mb-3"
      height="calc(100% - 68px)"
      style="overflow-y: scroll;"
      flat
    >
      <v-card
        class="mx-auto"
        min-height="calc(100% - 56px)"
        max-width="1100"
        width="100%"
        light
        flat
      >
        <v-card-actions>
          <div class="d-flex align-center pl-6">
            <v-icon
              color="accent"
              left
              v-text="titleIcon"
            />

            <v-card-title
              class="body-1 secondary--text font-weight-bold"
              v-text="titleText"
            />
          </div>

          <v-spacer />

          <section-menu
            :title="lesson.title"
            :items="sectionMenuItems"
          />
        </v-card-actions>

        <slot />

        <v-card-actions class="py-6">
          <v-btn
            class="font-weight-bold"
            color="accent"
            :disabled="prevButtonDisabled"
            @click="$emit('click:prev')"
            v-text="prevButtonText"
          />

          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            :disabled="nextButtonDisabled"
            @click="$emit('click:next')"
            v-text="nextButtonText"
          />
        </v-card-actions>
      </v-card>
    </v-card>
  </page-wrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PageWrapper from '~/components/presentational/PageWrapper'
import AppBar from '~/components/presentational/AppBar'
import SectionMenu from '~/components/presentational/SectionMenu'
export default {
  components: {
    PageWrapper,
    AppBar,
    SectionMenu
  },
  props: {
    titleIcon: {
      type: String,
      default: null
    },
    titleText: {
      type: String,
      default: null
    },
    prevButtonText: {
      type: String,
      default: null
    },
    nextButtonText: {
      type: String,
      default: null
    },
    prevButtonDisabled: {
      type: Boolean,
      default: false
    },
    nextButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      text: { title: 'progree' },
      lesson: null,
      progress: null,
      sectionMenuItems: [],
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
  async fetch () {
    if (this.user.isAdmin) {
      this.navMenuItems.push({
        icon: 'person',
        text: '管理者ページ',
        location: '/admin/'
      })
    }
    const lessonId = this.$route.params.lessonId
    this.lesson = this.$store.getters['data/theLesson'](lessonId)
    this.progress = this.$store.getters['data/theProgress'](lessonId) || {}
    this.sectionMenuItems = this.buildSectionMenu(this.lesson)
    await this.setProgress({
      id: this.lesson.id,
      merge: false,
      isOpen: true,
      isDoing: true,
      isClear: this.progress.isClear || false,
      scoreId: this.progress.scoreId || Date.now(),
      exercises: { ...this.progress.exercises }
    })
  },
  methods: {
    buildSectionMenu (lesson, menuItems = []) {
      lesson.slides.forEach((slide, index) => {
        menuItems.push({
          text: slide.title,
          location: {
            path: `/lessons/${lesson.id}/`,
            hash: `slide${index}`
          }
        })
      })
      menuItems.push(
        {
          divider: true,
          text: 'Sample Code',
          location: { path: `/lessons/${lesson.id}/code/` }
        },
        {
          divider: true,
          text: 'Exercise',
          location: { path: `/lessons/${lesson.id}/exercise/` }
        }
      )
      return menuItems
    },
    ...mapActions('data', ['setProgress'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['theLesson', 'theProgress'])
  }
}
</script>
