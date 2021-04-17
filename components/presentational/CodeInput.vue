<template>
  <div>
    <v-card
      color="transparent"
      width="100%"
      max-width="100%"
      flat
    >
      <v-card-title
        v-if="title"
        class="caption text--secondary px-0"
        v-text="title"
      />

      <div
        id="editorBox"
        style="border-radius: 4px; height: 300px;"
      />

      <v-card-actions class="px-0">
        <div
          class="caption text--secondary"
          v-text="message"
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
      v-if="resultText"
      class="pb-6"
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
        v-html="$html.$sanitize(resultText).replace(/\n/g, '<br>')"
      />
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ace from 'brace'
import 'brace/mode/python'
import 'brace/theme/clouds'
import '~/plugins/theme/clouds_onlyread'
export default {
  props: {
    code: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      text: {
        run: '保存して実行',
        result: '実行結果'
      },
      editor: null,
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
    this.editor.setFontSize(12)
    this.render()
  },
  methods: {
    render () {
      const code = this.code ? this.code.replace(/\\\\n/g, '\n') : ''
      this.editor.setTheme('ace/theme/clouds')
      this.editor.getSession().setValue(code, -1)
    },
    async runCode () {
      const code = this.editor.getValue()
      this.$emit('change', code.replace(/\n/g, '\\\\n'))
      if (code) {
        this.resultText = await this.submitCode(code)
      }
    },
    ...mapActions('data', ['submitCode'])
  }
}
</script>
