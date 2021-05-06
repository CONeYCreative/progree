<template>
  <page-wrapper>
    <app-bar
      :title="text.title"
      :user="user"
      :navMenuItems="navMenuItems.filter(item => !item.admin || user.isAdmin)"
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
export default {
  props: {
    lesson: {
      type: Object,
      default: () => ({})
    },
    progress: {
      type: Object,
      default: () => ({})
    },
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
  async fetch () {
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
            path: `/lessons/${lesson.id}/slide/`,
            hash: `slide${index}`
          }
        })
      })
      if (lesson.sample.code || lesson.sample.description) {
        menuItems.push(
          {
            divider: true,
            text: 'サンプルコード',
            location: `/lessons/${lesson.id}/code/`
          }
        )
      }
      if (Object.keys(lesson.exercises).length) {
        menuItems.push(
          {
            divider: true,
            text: 'エクササイズ',
            location: `/lessons/${lesson.id}/exercise/`
          }
        )
      }
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
