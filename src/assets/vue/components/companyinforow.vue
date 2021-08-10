<template>
  <div class="company-info-row">
    <img
      v-show="browser"
      :src="require('../../images/siteOutline.svg').default"
      class="company-info-row-icon"
    />
    <img
      v-show="tel"
      :src="require('../../images/phoneOutline.svg').default"
      class="company-info-row-icon"
    />
    <div class="company-info-row-values">
      <p
        v-show="tel"
        v-for="(item, index) in value"
        :key="index"
        :href="`tel:${item}`"
        @click="() => openTel(item)"
        class="company-info-row-value external"
      >
        {{ item }}
      </p>
      <a
        v-show="browser"
        v-for="item in value"
        :key="item"
        :href="item"
        target="_blank"
        rel="noopener noreferrer"
        class="company-info-row-value external"
        >{{ item }}</a
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'tel', 'browser'],
  data() {
    return { parsedData: '' }
  },
  methods: {
    openTel(phone) {
      window.open(`tel:${phone}`, '_system')
    }
  }
}
</script>
