<template>
  <v-dialog
    :value="value"
    min-width="320"
    max-width="600"
    width="auto"
    persistent
  >
    <v-card
      width="auto"
      min-width="320"
      max-width="600"
    >
      <v-btn
        :disabled="loading"
        absolute
        top
        right
        icon
        @click="close"
      >
        <v-icon
          color="primary"
          v-text="closeIcon"
        />
      </v-btn>

      <div
        v-if="loading"
        class="answer-dialog__flexbox"
      >
        <v-card
          class="ma-6"
          width="200"
        >
          <v-progress-linear indeterminate />
        </v-card>

        <v-card-title
          class="primary--text font-weight-bold"
          v-text="text.loading"
        />
      </div>

      <div
        v-else-if="isCorrect"
        class="answer-dialog__flexbox"
      >
        <v-icon
          class="answer-dialog__icon pa-2 mt-6"
          color="primary"
          x-large
          v-text="correctIcon"
        />

        <v-card-title
          class="primary--text font-weight-bold"
          v-text="text.correct"
        />

        <v-card-actions>
          <v-btn
            v-if="question.answerKeyCode"
            class="mx-2"
            color="accent"
            text
            small
            @click="dialogs.code = true"
            v-text="text.example"
          />

          <v-spacer />

          <v-btn
            class="mx-2"
            color="accent"
            depressed
            small
            @click="close"
            v-text="text.next"
          />
        </v-card-actions>
      </div>

      <div
        v-else
        class="answer-dialog__flexbox"
      >
        <v-icon
          class="answer-dialog__icon pa-2 mt-6"
          color="error"
          x-large
          v-text="closeIcon"
        />

        <v-card-title
          class="primary--text font-weight-bold"
          v-text="text.incorrect"
        />

        <v-card-text>
          <div v-if="isChoice">
            <div
              class="caption text--secondary font-weight-bold"
              v-text="text.answerKey"
            />

            <markdown :text="answerChoice.text" />
          </div>

          <div
            v-else
            v-text="text.retry"
          />
        </v-card-text>

        <v-card-actions
          v-if="isChoice"
          class="pb-6"
        >
          <v-spacer />

          <v-btn
            class="mx-2"
            color="accent"
            depressed
            small
            @click="close"
            v-text="text.next"
          />
        </v-card-actions>
      </div>
    </v-card>

    <answer-code-dialog
      v-if="question.answerKeyCode"
      v-model="dialogs.code"
      :code="question.answerKeyCode"
    />
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    answer: {
      type: String,
      default: null
    },
    answerCode: {
      type: String,
      default: null
    },
    question: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      loading: true,
      isChoice: false,
      isCorrect: false,
      dialogs: { code: false },
      closeIcon: 'close',
      correctIcon: 'check',
      answerChoice: {},
      text: {
        loading: '判定中！',
        correct: '正解！',
        incorrect: '残念！',
        next: '次の問題へ',
        example: '解答例',
        answerKey: '解答',
        retry: '文字の打ち間違えなどに気をつけて、もう一度トライしてみよう！'
      }
    }
  },
  fetch () {
    this.isChoice = this.question.type === 'choices'
    if (this.isChoice) {
      this.answerChoice = this.question.data.find(item => `${item.id}` === this.question.answerKey) || {}
    }
    this.fetchIsCorrect()
  },
  methods: {
    close () {
      if (this.isCorrect || this.isChoice) {
        this.$emit('next', true)
        this.$emit('input', false)
      } else {
        this.$emit('input', false)
      }
    },
    async fetchIsCorrect () {
      this.loading = true
      const answer = `${this.answer || ''}`.trim().replace(/\n/g, '\\\\n')
      const answerCode = `${this.answerCode || ''}`.trim().replace(/\n/g, '\\\\n')
      this.isCorrect = this.question.answerKey === answer
      await new Promise(resolve => setTimeout(resolve, 400))
      this.loading = false
      if (answer) {
        this.$emit('answer', {
          answer,
          answerCode,
          hinted: this.isHintShowed,
          isCorrect: this.isCorrect
        })
      }
    }
  },
  watch: {
    value (v) {
      if (v) {
        this.fetchIsCorrect()
      }
    }
  }
}
</script>

<style scoped>
.answer-dialog__flexbox {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
}
.answer-dialog__icon {
  border: 2px solid grey;
  border-radius: 50%;
}
</style>
