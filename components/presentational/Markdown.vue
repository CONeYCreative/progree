<template>
  <div
    class="markdown pr-2"
    v-html="markdown"
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
  created () {
    marked.setOptions({
      breaks: true,
      langPrefix: 'hljs ',
      highlight (code, lang) {
        return hljs.highlightAuto(code, [lang]).value
      }
    })
  },
  computed: {
    markdown () {
      return marked(this.text.replace(/\\\\n/g, '\n'))
    }
  }
}
</script>

<style src='@/assets/highlight.css'></style>
