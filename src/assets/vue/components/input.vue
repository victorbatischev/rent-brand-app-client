<template>
  <div>
    <div class="base-input-block">
      <p class="base-input-label">
        {{ title }}
      </p>
      <input
        :disabled="disabled"
        :ref="elRef"
        @blur="checkFocused"
        v-focus="autofocus"
        class="base-input"
        v-mask="pattern"
        :type="type"
        :placeholder="placeholder"
        :name="name"
        v-model="inputValue"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'title',
    'disabled',
    'type',
    'name',
    'placeholder',
    'pattern',
    'autofocus',
    'onlyfocused',
    'elRef',
    'value'
  ],
  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    checkFocused: function(e) {
      if (this.onlyfocused === 'true') {
        e.target.focus()
      }
    }
  }
}
</script>
