<template>
  <div class="d-flex align-start flex-wrap">
    <div style="width: 100%;">
      <v-card
        v-if="create"
        class="pa-3 ma-3 d-flex flex-column align-center justify-center"
        :width="size.width"
        :height="size.height"
        :max-width="size.width"
        :max-height="size.height"
        @click="$emit('click:create')"
      >
        <div class="d-flex">
          <v-icon
            color="accent"
            v-text="icons.create"
          />
          <v-card-title
            class="body-1 secondary--text font-weight-bold px-6"
            v-text="text.create"
          />
        </div>
      </v-card>
    </div>
    <v-card
      v-for="(lesson, i) of lessons"
      :key="i"
      class="pa-3 ma-3 d-flex flex-column align-center justify-center"
      :width="size.width"
      :max-width="size.width"
      :min-height="size.height"
      :ripple="false"
      @click="$emit('click:lesson', lesson)"
    >
      <v-btn
        v-if="close"
        style="top: 6px; right: 10px;"
        absolute
        icon
        @click="$emit('click:close', lesson)"
      >
        <v-icon
          v-text="icons.close"
        />
      </v-btn>

      <div class="d-flex">
        <v-icon
          color="accent"
          v-text="icons.lesson"
        />
        <v-card-title
          class="body-1 secondary--text font-weight-bold px-6"
          v-text="lesson.title"
        />
      </div>

      <v-card-text
        class="body-2"
        v-text="lesson.description"
      />

      <v-card-actions
        v-if="!simple"
        class="pa-0"
        style="min-width: 100%;"
      >
        <div
          v-if="progressObject[lesson.id] && progressObject[lesson.id].isClear"
          class="d-flex align-center px-3"
        >
          <v-icon
            color="accent"
            small
            left
            v-text="icons.done"
          />
          <div
            class="caption secondary--text font-weight-bold"
            v-text="text.cleared"
          />
        </div>

        <div
          v-else-if="progressObject[lesson.id]"
          class="d-flex align-center px-3"
        >
          <v-icon
            color="accent"
            small
            left
            v-text="icons.paused"
          />
          <div
            class="caption secondary--text font-weight-bold"
            v-text="text.paused"
          />
        </div>
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="primary"
          text
          @click="$emit('click:start', lesson)"
          v-text="!progressObject[lesson.id] || progressObject[lesson.id].isClear ? text.start : text.restart"
        />
      </v-card-actions>
    </v-card>

    <v-card
      v-if="!lessons.length"
      class="pa-3 ma-3 d-flex flex-column align-center justify-center transparent"
      :width="size.width"
      :height="size.height"
      :max-width="size.width"
      :max-height="size.height"
      flat
    >
      <div class="d-flex">
        <v-icon
          color="accent"
          v-text="icons.noLessons"
        />
        <v-card-title
          class="body-1 secondary--text font-weight-bold px-6"
          v-text="text.noLessons"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    lessons: {
      type: Array,
      default: () => []
    },
    progress: {
      type: Array,
      default: () => []
    },
    simple: {
      type: Boolean,
      default: false
    },
    close: {
      type: Boolean,
      default: false
    },
    create: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      size: {
        height: 160,
        width: 320
      },
      icons: {
        lesson: 'flash_on',
        done: 'check_circle',
        noLessons: 'check',
        close: 'close',
        paused: 'pause',
        create: 'create'
      },
      text: {
        start: '始める',
        restart: '再開する',
        noLessons: 'レッスンはありません',
        cleared: 'クリア済みです',
        paused: '途中です',
        create: '新しいレッスンを作成'
      },
      progressObject: {}
    }
  },
  fetch () {
    this.progress.forEach(p => {
      this.progressObject[p.id] = p
    })
  }
}
</script>
