<template>
  <div>
    <v-card
      class="px-1 mb-1 primary"
      height="430"
      width="100%"
      max-width="100%"
      dark
    >
      <v-card-title
        class="body-2 font-weight-bold py-1"
        v-text="text.title"
      />

      <div
        id="editorBox"
        style="border-radius: 4px; height: 360px;"
      />

      <v-card-actions class="pa-2">
        <v-btn
          class="font-weight-bold ma-0"
          text
          small
          @click="resetCode"
          v-text="text.reset"
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

    <v-card
      width="100%"
      max-width="100%"
      dark
    >
      <v-card-title
        class="body-2 pt-2 pb-1 font-weight-bold"
        v-text="text.result"
      />
      <v-divider class="ma-2 mt-0" />
      <v-card-text
        class="py-0"
        v-html="sanitizing(resultText)"
      />
      <v-card-actions class="pa-2">
        <v-spacer />

        <v-btn
          class="font-weight-bold"
          color="accent"
          :disabled="!resultText"
          small
          @click="answer"
          v-text="text.submit"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ace from 'brace'
import 'brace/mode/python'
import 'brace/theme/clouds'
import '~/plugins/theme/clouds_onlyread'
import Markdown from '~/components/presentational/Markdown'
export default {
  components: { Markdown },
  props: {
    code: {
      type: String,
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
        title: 'Python コードエディター',
        reset: 'リセット',
        run: '実行',
        result: '実行結果',
        submit: '回答する'
      },
      editor: null,
      editable: true,
      resultText: null
    }
  },
  mounted () {
    this.editor = ace.edit('editorBox')
    this.editor.$blockScrolling = Infinity
    this.editor.getSession().setMode('ace/mode/python')
    this.editor.getSession().setTabSize(2)
    this.editor.getSession().setUseSoftTabs(true)
    this.editor.getSession().setNavigateWithinSoftTabs(true)
    this.editor.getSession().setUseWrapMode(true)
    this.editor.setFontSize(16)
    this.render()
  },
  methods: {
    render () {
      const code = this.editor.getValue() || this.lastCode.replace(/\\\\n/g, '\n') || this.code.replace(/\\\\n/g, '\n')
      const theme = this.editable ? 'ace/theme/clouds' : 'ace/theme/clouds_onlyread'
      this.editor.setTheme(theme)
      this.editor.setReadOnly(!this.editable)
      this.editor.getSession().setValue(code, -1)
    },
    sanitizing (string) {
      return string ? string.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br>') : ''
    },
    async resetCode () {
      const confirm = window.confirm('コードをリセットしてもよろしいですか？')
      if (!confirm) { return }
      this.editor.getSession().setValue(this.code.replace(/\\\\n/g, '\n'), -1)
    },
    async runCode () {
      this.editable = false
      const code = this.editor.getValue()
      if (code) {
        this.resultText = await this.submitCode(code)
      }
      this.editable = true
    },
    async answer () {
      const confirm = window.confirm('この結果で回答してもよろしいですか？')
      if (!confirm) { return }
      this.$emit('answer', {
        code: this.editor.getValue(),
        answer: this.resultText
      })
    },
    ...mapActions('data', ['submitCode'])
  },
  watch: {
    editable () { this.render() }
  }
}
</script>
