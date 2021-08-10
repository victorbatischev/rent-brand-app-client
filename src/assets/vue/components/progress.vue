<template>
  <div class="loyalty-info-body-progress">
    <div
      class="loyalty-info-body-progress-active"
      :style="'width:' + getWidth() + '%'"
    />
  </div>
</template>

<script>
export default {
  props: ['now', 'full'],
  methods: {
    getWidth() {
      return (parseInt(this.now) / parseInt(this.full)) * 100
    }
  }
}
</script>
