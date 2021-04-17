<template>
  <div>
    <v-text-field
      v-if="inputType === 'text-field'"
      v-bind="bindings"
      :value="value"
      :name="name || `${Date.now()}`"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
    />

    <v-textarea
      v-else-if="inputType === 'textarea'"
      v-bind="bindings"
      :value="value"
      :name="name || `${Date.now()}`"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
    />

    <v-select
      v-else-if="inputType === 'select'"
      v-bind="bindings"
      :value="value"
      :name="name || `${Date.now()}`"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
    />

    <v-file-input
      v-else-if="inputType === 'file'"
      v-bind="bindings"
      :value="value"
      :name="name || `${Date.now()}`"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    inputType: {
      type: String,
      default: 'text-field'
    },
    name: {
      type: String,
      default: null
    },
    itemValue : {
      type: String,
      default: null
    },
    itemText : {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    },
    hideDetails: {
      type: String,
      default: 'auto'
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    prependIcon: {
      type: String,
      default: null
    },
    accept: {
      type: String,
      default: null
    },
    counter: {
      type: Number,
      default: null
    },
    value: {
      type: [String, Number, Array],
      default: null
    },
    messages: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    noResize: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    hideInput: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      propsKeys: [
        'color',
        'hideDetails',
        'label',
        'placeholder',
        'hint',
        'messages',
        'counter',
        'value',
        'rules',
        'validateOnBlur',
        'outlined',
        'noResize',
        'items',
        'itemValue',
        'itemText',
        'multiple',
        'accept',
        'hideInput',
        'prependIcon'
      ],
      bindings: {}
    }
  },
  fetch () {
    const props = { ...this.$options.propsData }
    for (const property of this.propsKeys) {
      this.bindings[property] = property in props ? props[property] : this[property]
    }
  }
}
</script>
