<template>
  <v-dialog
    :value="value"
    persistent
  >
    <v-card class="pa-6">
      <v-card-title
        class="secondary--text font-weight-bold px-6"
        v-text="title"
      />

      <v-form
        ref="exerciseForm"
        @submit.prevent
        :disabled="loading"
      >
        <custom-input
          class="pa-3"
          input-type="select"
          label="エキササイズ"
          item-value="id"
          item-text="id"
          :items="exercises"
          :rules="[v => !!v || '選択してください']"
          @change="changeExercise"
        />

        <div v-if="formActive">
          <custom-input
            v-show="!updatable"
            v-model="exercise.id"
            class="pa-3"
            input-type="select"
            label="ID"
            :rules="[v => !!v || '選択してください']"
            :items="exerciseIds"
          />

          <custom-input
            v-model="exercise.quota"
            class="pa-3"
            input-type="select"
            label="ノルマ"
            :rules="[v => !!v || '選択してください']"
            :items="quotaNumbers"
          />

          <custom-input
            class="pa-3"
            v-model="exercise.title"
            label="タイトル"
            :rules="[v => !v || v.length <= 64 || '64文字以内で入力してください']"
            :counter="64"
          />
        </div>

      </v-form>

      <v-card-actions>
        <v-btn
          class="font-weight-bold text--secondary"
          :disabled="loading"
          text
          @click="$emit('canceled')"
          v-text="text.cancel"
        />

        <v-spacer />

        <v-btn
          v-if="updatable && !formActive"
          class="font-weight-bold text--secondary"
          :disabled="loading"
          text
          @click="formActive = true"
          v-text="text.update"
        />

        <v-btn
          v-if="formActive"
          class="font-weight-bold"
          color="accent"
          :disabled="loading || !exercise.id || !exercise.quota"
          @click="submitExercise(exercise)"
          v-text="text.saveAndSelect"
        />

        <v-btn
          v-else
          class="font-weight-bold"
          color="accent"
          :disabled="loading || !exercise.id || !exercise.quota"
          @click="selectExercise(exercise)"
          v-text="text.select"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import CustomInput from '~/components/presentational/CustomInput'
export default {
  components: { CustomInput },
  props: {
    value: {
      type: Boolean,
      default: false,
      require: true
    },
    lesson: {
      type: Object,
      default: () => ({}),
      require: true
    },
    create: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null,
      require: true
    }
  },
  data () {
    return {
      loading: false,
      exercise: {},
      exercises: [],
      exerciseIds: ['exercise1', 'exercise2', 'exercise3', 'exercise4', 'exercise5'],
      quotaNumbers: [1, 2, 3, 4, 5],
      text: {
        update: '編集',
        select: '選択',
        saveAndSelect: '保存して選択',
        cancel: 'キャンセル'
      },
      formActive: false,
      updatable: false
    }
  },
  fetch () {
    // idが指定されていた時
    const exerciseId = this.$route.query?.exercise
    if (exerciseId) {
      const exercise = this.lesson.exercises[exerciseId]
      if (exercise) {
        this.selectExercise(exercise)
        return
      }
    }
    // 指定されたレッスンのエキササイズ一覧を作成
    const exerciseIds = Object.keys(this.lesson.exercises || {}).sort()
    this.exercises = exerciseIds.map(exerciseId => {
      const exercise = this.lesson.exercises[exerciseId]
      const clone = JSON.parse(JSON.stringify(exercise))
      return { id: exerciseId, ...clone }
    })
    this.exercises.unshift({ id: '' })
    // エキササイズの追加が許可されている時
    if (this.create) {
      // 追加可能なエキササイズのIDリストを作成
      for (const exercise of this.exercises) {
        if (exercise.id) {
          this.exerciseIds = this.exerciseIds.filter(item => item !== exercise.id)
        }
      }
      if (!!this.exerciseIds.length) {
        this.exercises.push({ id: 'エキササイズを追加' })
      }
    }
  },
  methods: {
    changeExercise (exerciseId) {
      this.formActive = exerciseId === 'エキササイズを追加'
      const exercise = this.exercises.find(exercise => exercise.id === exerciseId)
      this.exercise = exercise && !this.formActive ? exercise : {}
      this.updatable = !!this.exercise.id
    },
    async submitExercise (exercise) {
      if (!this.$refs.exerciseForm.validate()) {
        return alert('正しく入力されていない欄があります。')
      }
      this.loading = true
      await this.setLessons({
        id: this.lesson.id,
        merge: true,
        exercises: {
          [exercise.id]: exercise
        }
      })
      this.loading = false
      this.selectExercise(exercise)
    },
    selectExercise (exercise) {
      const clone = JSON.parse(JSON.stringify(exercise))
      this.$emit('selected', clone)
    },
    ...mapActions('data', ['setLessons'])
  }
}
</script>
