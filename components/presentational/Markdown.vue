<template>
  <div
    class="markdown"
    v-html="markdown"
    @drag="$emit('drag', $event)"
  />
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
export default {
  props: {
    text: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      markdown: null
    }
  },
  created () {
    marked.setOptions({
      breaks: true,
      langPrefix: 'hljs ',
      highlight (code, lang) {
        return hljs.highlightAuto(code, [lang]).value
      }
    })
  },
  fetch() {
    this.render(this.text)
  },
  methods: {
    render (text) {
      this.markdown = marked((text || '').replace(/\\\\n/g, '\n'))
    }
  },
  watch: {
    text (text) {
      this.render(text)
    }
  }
}
</script>

<style src='@/assets/highlight.css'></style>
