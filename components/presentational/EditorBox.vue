<template>
  <div class="d-flex flex-wrap">
    <v-card
      class="pa-6"
      style="overflow: auto;"
      max-height="410"
      :width="isMobile ? '100%' : '40%'"
      :max-width="isMobile ? '100%' : '40%'"
      flat
    >
      <markdown :text="description" />
    </v-card>

    <v-card
      class="px-1 primary"
      height="430"
      :width="isMobile ? '100%' : '60%'"
      :max-width="isMobile ? '100%' : '60%'"
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
          v-show="editable"
          class="font-weight-bold ma-0"
          text
          small
          @click="editable = false"
          v-text="text.reset"
        />
        <v-btn
          v-show="!editable"
          class="font-weight-bold ma-0"
          small
          text
          @click="editable = true"
          v-text="text.edit"
        />
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="accent"
          small
          @click="submit"
          v-text="text.do"
        />
      </v-card-actions>

      <v-dialog
        v-model="result"
        max-height="430"
        max-width="320"
      >
        <v-card dark>
          <v-card-title
            class="body-1 font-weight-bold"
            v-text="text.result"
          />
          <v-divider class="mx-2 mb-4" />
          <v-card-text v-html="sanitizing(resultText)" />
        </v-card>
      </v-dialog>
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
    description: {
      type: String,
      default: null
    },
    code: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      text: {
        title: 'Python コードエディター',
        reset: 'リセット',
        edit: 'コードを書き換える',
        save: '保存',
        do: '実行',
        result: '実行結果'
      },
      editor: null,
      editable: false,
      result: false,
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
      const code = this.code ? this.code.replace(/\\\\n/g, '\n') : ''
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
    async submit () {
      const code = this.editor.getValue()
      if (code) {
        this.resultText = await this.submitCode(code)
        this.result = true
      }
    },
    ...mapActions('data', ['submitCode'])
  },
  watch: {
    editable () { this.render() }
  },
  computed: {
    isMobile () {
      const name = this.$vuetify.breakpoint.name
      return name === 'xs' || name === 'sm'
    }
  }
}
</script>
