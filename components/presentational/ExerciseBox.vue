<template>
  <div class="d-flex flex-wrap">
    <v-card
      class="exercise-box__desc pa-2"
      :class="{ 'mr-3': !isMobile, 'mb-3': isMobile }"
      :width="isMobile ? '100%' : 'calc(40% - 18px)'"
      :max-width="isMobile ? '100%' : 'calc(40% - 18px)'"
      flat
    >
      <v-card-title v-text="text.title" />

      <v-card-text v-text="text[question.type]" />

      <markdown
        class="px-4"
        :text="question.text"
      />

      <v-card-actions v-if="hint">
        <v-spacer />

        <v-btn
          class="font-weight-bold"
          color="accent"
          small
          @click="showHint"
          v-text="text.hint"
        />
      </v-card-actions>
    </v-card>

    <v-card
      v-if="question.type === 'editing' || question.type === 'coding'"
      :width="isMobile ? '100%' : '60%'"
      :max-width="isMobile ? '100%' : '60%'"
      flat
    >
      <editable-exercise-box
        :code="code"
        :last-code="lastCode"
        @answer="submitAnswer($event)"
      />
    </v-card>

    <v-card
      v-else
      class="pa-1"
      style="border: 1px solid #419eb2;"
      :width="isMobile ? '100%' : '60%'"
      :max-width="isMobile ? '100%' : '60%'"
      flat
    >
      <v-card-title
        v-if="/(draganddrop|choices)/.test(question.type)"
        class="body-1 primary--text font-weight-bold"
        v-text="text.options"
      />

      <draggable-exercise-box
        v-if="question.type === 'draganddrop'"
        :question="question"
        :options="options"
        @submit="$event => { answer = $event }"
      />

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
          :key="option.id"
          class="pa-3 mb-3 d-flex align-center"
          :ripple="false"
          light
          flat
          @click="answer = option.id"
        >
          <v-radio
            class="mb-0"
            :value="option.id"
            :ripple="false"
          />

          <markdown
            class="markdown--options"
            :text="option.text"
          />
        </v-card>
      </v-radio-group>

      <v-card-actions class="pa-2">
        <v-spacer />

        <v-btn
          class="font-weight-bold"
          color="accent"
          :disabled="!answer"
          small
          @click="submitAnswer({ answer })"
          v-text="text.submit"
        />
      </v-card-actions>
    </v-card>

    <hint-dialog
      v-model="dialogs.hint"
      :hint="hint"
    />

    <answer-dialog
      v-model="dialogs.answer"
      :answer="answer"
      :code="answerCode"
      :question="question"
      @answer="$emit('answer', $event)"
      @next="$emit('next', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => ({})
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
      loading: false,
      code: null,
      hint: null,
      options: null,
      conditions: null,
      isHintShowed: false,
      isCorrect: false,
      answer: null,
      answerCode: null,
      dialogs: {
        hint: false,
        answer: false
      },
      text: {
        title: 'Question',
        submit: '回答する',
        options: '選択肢',
        choices: '選択肢の中から正しいものを選択してください！',
        writing: '適切な答えを入力してください！',
        editing: 'エディタ内のコードを訂正してください！',
        coding: '条件に従ってコードを作成してください！',
        input: '答えを入力',
        confirmHint: 'ヒントを表示してもよろしいですか？',
        hint: 'ヒント'
      }
    }
  },
  fetch () {
    this.text.title += ` ${this.clearedQuestionNumber}`
    const data = this.question.data
    this.options = this.shuffleArray(data.filter(e => e.type === 'option'))
    this.conditions = data.filter(e => e.type === 'condition')
    this.code = data.find(e => e.type === 'code')?.text || ''
    this.hint = data.find(e => e.type === 'hint')?.text || ''
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
    },
    showHint () {
      const confirm = window.confirm(this.text.confirmHint)
      this.dialogs.hint = confirm
      this.isHintShowed = true
    },
    async submitAnswer (answerObj) {
      this.answer = answerObj.answer
      this.answerCode = answerObj.code
      this.dialogs.answer = true
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
.exercise-box__desc {
  border: 1px solid #419eb2 !important;
  border-radius: 4px;
  overflow: auto;
}
</style>
