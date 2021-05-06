<template>
  <div>
    <v-card
      @dragend="dragEnd"
      @dragstart="dragStart"
      @dragover.prevent
      @drop="dropEnd"
      flat
    >
      <draggable
        id="draggables"
        class="d-flex flex-wrap px-4"
        style="min-height: 200px;"
        draggable=".draggables__item"
        :sort="false"
      >
        <markdown
          v-for="option of options"
          :key="option.id"
          class="draggables__item d-inline-block ma-6 mb-0"
          :class="{ [`draggable-item-${option.id}`]: true }"
          :text="option.text"
        />

        <v-card-text
          id="drop-divider"
          class="text-center ma-6"
          v-text="text.description"
        />

        <v-card
          class="droppables pa-4"
          color="#0000000d"
          width="100%"
          :draggable="false"
          flat
          v-html="format"
        />
      </draggable>
    </v-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Markdown from '~/components/presentational/Markdown'
export default {
  components: {
    Markdown,
    draggable
  },
  props: {
    question: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      text: {
        description: 'この下の枠内にドラッグ＆ドロップ'
      },
      format: null,
      droppables: {},
      dragged: null,
      result: {}
    }
  },
  fetch () {
    const formatItem = this.question.data.find(e => e.type === 'format')
    let row = 0
    let keyNumber = 1
    this.format = formatItem.text
      .replace(/\s/g, '<span style="padding-right: 9px !important;"></span>')
      .replace(/^/g, `<div class="d-flex align-center"><span class="text--secondary" style="padding-right: 24px !important;">${++row}</span>`)
      .replace(/$/g, `</div>`)
      .replace(/\\\\n/g, () => { return `</div><div class="d-flex align-center"><span class="text--secondary" style="padding-right: 24px !important;">${++row}</span>` })
      .replace(/{{(big|medium|small)}}/g, val => {
        const size = val === '{{big}}' ? 200
          : val === '{{medium}}' ? 100
            : val === '{{small}}' ? 40 : 0
        const elementId = `droppable-item-${keyNumber++}`
        return `<div
          id="${elementId}"
          key="${elementId}"
          class="d-inline-block droppables__item"
          style="width: ${size}px;"
        >　</div>`
      })
  },
  mounted () {
    const droppables = document.getElementsByClassName('droppables__item')
    for (const droppable of droppables) {
      droppable.addEventListener('dragover', this.mouseOverTheDroppable)
      droppable.addEventListener('dragleave', this.mouseLeaveTheDroppable)
    }
  },
  beforeDestroy () {
    const droppables = document.getElementsByClassName('droppables__item')
    for (const droppable of droppables) {
      droppable.removeEventListener('dragover', this.mouseOverTheDroppable)
      droppable.removeEventListener('dragleave', this.mouseLeaveTheDroppable)
    }
  },
  methods: {
    mouseOverTheDroppable (e) {
      e.srcElement.classList.add('droppables__item--mouseover')
    },
    mouseLeaveTheDroppable (e) {
      e.srcElement.classList.remove('droppables__item--mouseover')
    },
    dragStart (e) {
      document.getElementsByTagName('html').item(0).classList.add('grabbing')
      this.dragged = e.srcElement
    },
    dragEnd (e) {
      e.srcElement.draggable = true
      this.dragged = null
    },
    dropEnd (e) {
      const dropped = e.srcElement
      const dragged = this.dragged
      // drop されたのが droppable item 上か？
      const isDroppable = /droppable-item-\d+/.test(dropped.id)
      // drag しているのはすでに drop された item か？
      const isDropped = /dropped-item-\d+/.test(dragged.id)
      // drag されている item の id
      const draggedItemId = [...dragged.classList].find(val => /draggable-item-\d+/.test(val))?.replace('draggable-item-', '')
      if (isDroppable && !isDropped) {
        // 枠外のアイテムが枠内にドロップ
        this.result[draggedItemId] = dropped.id.replace('droppable-item-', '')
        dropped.classList.remove('droppables__item--mouseover')
        this.droppables[dropped.id] = dropped.cloneNode(true)
        dragged.id = dropped.id.replace('droppable', 'dropped')
        dropped.replaceWith(dragged)
      } else if (isDroppable && isDropped) {
        // 枠内のアイテムが別の枠内にドロップ
        this.result[draggedItemId] = dropped.id.replace('droppable-item-', '')
        const clonedDragged = dragged.cloneNode(true)
        const droppable = this.droppables[dragged.id.replace('dropped', 'droppable')]
        droppable.addEventListener('dragover', this.mouseOverTheDroppable)
        droppable.addEventListener('dragleave', this.mouseLeaveTheDroppable)
        dragged.replaceWith(droppable)
        dropped.classList.remove('droppables__item--mouseover')
        this.droppables[dropped.id] = dropped.cloneNode(true)
        clonedDragged.id = dropped.id.replace('droppable', 'dropped')
        dropped.replaceWith(clonedDragged)
      } else if (!isDroppable && isDropped) {
        // 枠内のアイテムが枠外にドロップ
        this.result[draggedItemId] = null
        const clonedDragged = dragged.cloneNode(true)
        clonedDragged.id = null
        const droppable = this.droppables[dragged.id.replace('dropped', 'droppable')]
        droppable.addEventListener('dragover', this.mouseOverTheDroppable)
        droppable.addEventListener('dragleave', this.mouseLeaveTheDroppable)
        dragged.replaceWith(droppable)
        const draggables = document.getElementById('draggables')
        const droppables = document.getElementById('drop-divider')
        const alternative = document.createElement('div')
        draggables.insertBefore(alternative, droppables)
        alternative.replaceWith(clonedDragged)
      }
      document.getElementsByTagName('html').item(0).classList.remove('grabbing')
    }
  },
  watch: {
    'dragged' () {
      const resultIds = [...Object.keys(this.result)].sort()
      const droppedCount = resultIds.filter(id => !!this.result[id]).length
      let answer = ''
      if (droppedCount === this.options.length) {
        for (const resultId of resultIds) {
          answer += this.result[resultId]
        }
      }
      this.$emit('submit', answer)
    }
  }
}
</script>

<style>
.draggables__item {
  cursor: grab;
}
.grabbing *,
.grabbing *:before,
.grabbing *:after,
.grabbing *:hover,
.grabbing *:active,
.draggables__item:active {
  cursor: move !important;
  cursor: grabbing !important;
}
.draggables__item code {
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 24px !important;
  height: 24px !important;
}
.draggables__item:active code {
  background-color: #0000000d !important;
  padding: 0 10px !important;
  margin: 0 -10px !important;
  cursor: grabbing !important;
}
.draggables__item p {
  margin-bottom: 0 !important;
}
.droppables * {
  font-size: 14px !important;
  line-height: 24px !important;
  height: 24px !important;
}
.droppables .draggables__item {
  margin: 0 !important;
  padding: 0 !important;
}
.droppables code {
  padding: 0 !important;
  margin: 0 !important;
}
.droppables__item {
  margin: 2px 0;
  height: 20px !important;
  border: 2px solid #9ECDD6;
}
.droppables__item--mouseover {
  border: 2px solid red;
}
</style>
