<template>
  <v-dialog
    :value="value"
    max-width="600"
    persistent
  >
    <v-card
      class="d-flex flex-column align-center justify-center"
      width="auto"
      min-height="120"
      min-width="300"
    >
      <v-btn
        :disabled="loading || correct || question.type === 'choices'"
        absolute
        top
        right
        icon
        @click="close"
      >
        <v-icon
          color="primary"
          v-text="icons.close"
        />
      </v-btn>

      <v-icon
        v-if="!loading"
        class="pa-2 mt-6"
        style="border: 2px solid grey; border-radius: 50%;"
        :color="correct ? 'primary' : 'error'"
        x-large
        v-text="correct ? icons.correct : icons.close"
      />

      <v-card-title
        class="primary--text font-weight-bold"
        v-text="loading ? text.loading : correct ? text.correct : text.incorrect"
      />

      <v-card
        v-if="loading"
        class="mx-6 mb-6"
        width="200"
      >
        <v-progress-linear indeterminate />
      </v-card>

      <v-card-text v-if="!correct && !loading" >
        <div v-html="text.help" />
        <markdown
          v-if="text.helpMarkdown"
          :text="text.helpMarkdown"
        />
      </v-card-text>

      <v-card-actions
        v-if="correct && !loading || question.type === 'choices'"
        class="pb-6"
      >
        <v-btn
          v-if="question.answerKeyCode"
          class="mx-2"
          color="accent"
          text
          small
          @click="seeAnswer"
          v-text="text.example"
        />

        <v-spacer v-if="question.answerKeyCode" />

        <v-btn
          class="mx-2"
          color="accent"
          depressed
          small
          @click="next"
          v-text="text.button"
        />
      </v-card-actions>
    </v-card>

    <v-dialog v-model="answerkey">
      <v-card
        class="d-flex flex-column align-center justify-center"
        width="auto"
        min-width="600"
        min-height="400"
      >
        <v-card-title
          class="body-2 font-weight-bold py-1"
          v-text="text.example"
        />

        <div
          id="answerCodeBox"
          style="border-radius: 4px; width: 600px; height: 400px;"
        />

        <v-card-actions style="width: 100%;">
          <v-btn
            class="font-weight-bold"
            color="primary"
            text
            small
            @click="answerkey = false"
            v-text="text.close"
          />

          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            small
            @click="runCode"
            v-text="text.run"
          />
        </v-card-actions>
      </v-card>

      <v-dialog
        v-model="result"
        max-height="430"
        max-width="320"
      >
        <v-card dark>
          <v-btn
            style="top: 10px;"
            absolute
            top
            right
            icon
            @click="result = false"
          >
            <v-icon
              color="primary"
              v-text="icons.close"
            />
          </v-btn>
          <v-card-title
            class="body-1 font-weight-bold"
            v-text="text.result"
          />
          <v-divider class="mx-2 mb-4" />
          <v-card-text v-html="sanitizing(resultText)" />
        </v-card>
      </v-dialog>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import ace from 'brace'
import 'brace/mode/python'
import 'brace/theme/clouds'
import '~/plugins/theme/clouds_onlyread'
import Markdown from '~/components/presentational/Markdown'

export default {
  components: {
    Markdown,
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    correct: {
      type: Boolean,
      default: false
    },
    question: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      answerkey: false,
      result: false,
      resultText: null,
      icons: {
        close: 'close',
        correct: 'check'
      },
      text: {
        loading: '判定中！',
        correct: '正解！',
        incorrect: '残念！',
        help: null,
        button: '次の問題へ',
        example: '解答例',
        run: '実行する',
        result: '実行結果',
        close: '閉じる'
      }
    }
  },
  fetch () {
    if (this.question.type === 'choices') {
      this.text.help = '解答'
      this.text.helpMarkdown = `${this.question.data.find(item => `${item.code}` === this.question.answerKey)?.text}`
    } else {
      this.text.help = '文字の打ち間違えなどに気をつけて、<br>もう一度トライしてみよう！'
      this.text.helpMarkdown = null
    }
  },
  methods: {
    close () { this.$emit('input', false) },
    next () { this.$emit('next') },
    async runCode () {
      const code = this.editor.getValue()
      if (code) {
        this.resultText = await this.submitCode(code)
        this.result = true
      }
    },
    seeAnswer () {
      this.answerkey = true
      setTimeout(() => {
        this.editor = ace.edit('answerCodeBox')
        this.editor.$blockScrolling = Infinity
        this.editor.getSession().setMode('ace/mode/python')
        this.editor.getSession().setTabSize(2)
        this.editor.getSession().setUseSoftTabs(true)
        this.editor.getSession().setNavigateWithinSoftTabs(true)
        this.editor.getSession().setUseWrapMode(true)
        this.editor.setFontSize(12)
        this.editor.setTheme('ace/theme/clouds_onlyread')
        this.editor.setReadOnly(true)
        this.editor.getSession().setValue(this.question.answerKeyCode.replace(/\\\\n/g, '\n'), -1)
      }, 100)
    },
    sanitizing (string) {
      return string ? string.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br>') : ''
    },
    ...mapActions('data', ['submitCode'])
  },
  watch: {
    'question.id' () { this.$fetch() }
  }
}
</script>

<style>
.v-dialog {
  width: auto !important;
}
</style>

