<template>
  <div class="accordion-item-opened">
    <div
      v-for="item in items"
      :key="item.id"
      class="accordion-item-content"
      @click="handleClick(item)"
    >
      <div class="accordion-item-image-container">
        <img
          v-if="item.image && item.image.url"
          :src="item.image.url"
          class="accordion-item-image"
        />
      </div>

      <div class="accordion-item-text-container">
        <p class="accordion-item-text-head">{{ item.contentHeader }}</p>
        <p class="accordion-item-text">{{ item.content }}</p>
        <p class="accordion-item-desc">{{ item.desc }}</p>
        <p class="accordion-item-modificator">{{ item.modificator }}</p>
        <p class="accordion-item-price">{{ item.price }} ₽</p>
        <img
          v-if="showBasket"
          :src="require('../../images/plus.svg').default"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'showBasket'],
  methods: {
    handleClick(item) {
      this.$emit('selected', item)
    }
  }
}
</script>
