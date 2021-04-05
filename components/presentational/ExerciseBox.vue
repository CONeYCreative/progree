<template>
  <div class="d-flex flex-wrap">
    <v-card
      :width="isMobile ? '100%' : '40%'"
      :max-width="isMobile ? '100%' : '40%'"
      flat
    >
      <v-card-title v-text="text.title" />

      <v-card-text v-text="text[question.type]" />

      <markdown
        class="pa-4"
        :class="{ 'mr-3': !isMobile }"
        style="border-radius: 4px; border: 1px solid #419eb2;"
        :text="question.text"
      />
    </v-card>

    <v-card
      v-if="question.type === 'editing' || question.type === 'coding'"
      :width="isMobile ? '100%' : '60%'"
      :max-width="isMobile ? '100%' : '60%'"
      flat
    >
      <exercise-editor-box
        :code="code"
        :last-code="lastCode"
        @answer="$emit('answer', $event)"
      />
    </v-card>

    <v-card
      v-else
      class="pa-1"
      style="border: 1px solid #419eb2;"
      :width="isMobile ? '100%' : '60%'"
      :max-width="isMobile ? '100%' : '60%'"
    >
      <v-card-text
        v-if="!!conditions.length"
        class="ma-0 pa-3"
      >
        <p
          v-for="(condition, i) of conditions"
          :key="i"
          class="secondary--text"
          v-text="condition.text"
        />
      </v-card-text>

      <v-text-field
        v-if="question.type === 'writing'"
        :label="text.input"
        class="ma-0 pa-3 py-6"
        hide-details
        v-model="answer"
      />

      <v-radio-group
        v-if="question.type === 'choices'"
        class="ma-0 pa-3"
        hide-details
        v-model="answer"
      >
        <v-card
          v-for="option of options"
          :key="option.code"
          class="px-3 mb-3"
          light
          flat
        >
          <v-radio :value="option.code">
            <template #label>
              <markdown
                class="markdown--options"
                :text="option.text"
              />
            </template>
          </v-radio>
        </v-card>
      </v-radio-group>

      <v-card-actions class="pa-2">
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="accent"
          :disabled="!answer"
          small
          @click="$emit('answer', { answer })"
          v-text="text.submit"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Markdown from '~/components/presentational/Markdown'
import ExerciseEditorBox from '~/components/presentational/ExerciseEditorBox'
export default {
  components: {
    Markdown,
    ExerciseEditorBox
  },
  props: {
    question: {
      type: Object,
      default: () => ({})
    },
    quota: {
      type: Number,
      default: null
    },
    clearedQuestionNumber: {
      type: Number,
      default: null
    },
    lastCode: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      text: {
        title: 'Question',
        submit: '回答する',
        choices: '選択肢の中から正しいものを選択してください！',
        writing: '適切な答えを入力してください！',
        editing: 'エディタ内のコードを訂正してください！',
        coding: '条件に従ってコードを作成してください！',
        input: '答えを入力'
      },
      code: null,
      options: null,
      conditions: null,
      answer: null
    }
  },
  fetch () {
    this.text.title += ` ${this.clearedQuestionNumber}`
    this.options = this.question.data.filter(e => e.type === 'option')
    this.options = this.shuffleArray(this.options)
    this.conditions = this.question.data.filter(e => e.type === 'condition')
    this.code = this.question.data.find(e => e.type === 'code')?.text || ''
  },
  methods: {
    shuffleArray (input) {
      const array = [...input]
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * i)
        const clone = [...array]
        array[j] = clone[i]
        array[i] = clone[j]
      }
      return array
    }
  },
  computed: {
    isMobile () {
      const name = this.$vuetify.breakpoint.name
      return name === 'xs' || name === 'sm'
    }
  }
}
</script>

<style>
.markdown--options p {
  margin-bottom: 0 !important;
}
</style>
