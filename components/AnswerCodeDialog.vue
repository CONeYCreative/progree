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

      <v-card-title
        class="body-2 font-weight-bold py-6"
        v-text="text.example"
      />

      <div
        id="answerCodeBox"
        style="border-radius: 4px; width: 100%; height: 400px;"
      />

      <v-card-actions style="width: 100%;">
        <v-btn
          class="font-weight-bold"
          color="primary"
          text
          small
          @click="close"
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
            v-text="closeIcon"
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
</template>

<script>
import { mapActions } from 'vuex'
import ace from 'brace'
import 'brace/mode/python'
import 'brace/theme/clouds'
import '~/plugins/theme/clouds_onlyread'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      editor: null,
      result: false,
      resultText: null,
      closeIcon: 'close',
      text: {
        example: '解答例',
        run: '実行する',
        result: '実行結果',
        close: '閉じる'
      }
    }
  },
  methods: {
    render () {
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
      this.editor.getSession().setValue(this.code.replace(/\\\\n/g, '\n'), -1)
    },
    close () {
      this.$emit('input', false)
    },
    async runCode () {
      const code = this.editor.getValue()
      if (code) {
        this.resultText = await this.submitCode(code)
        this.result = true
      }
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
    async value (v) {
      if (v) {
        await new Promise(resolve => setTimeout(resolve, 100))
        this.render()
      }
    }
  }
}
</script>
