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
      <div
        v-show="tel"
        v-for="(item, index) in value"
        :key="index"
        @click="openTel(item)"
        class="company-info-row-value external"
      >
        {{ item }}
      </div>
      <div>
        <f7-link
          v-show="browser"
          v-for="item in value"
          :key="item"
          :href="'http://' + item"
          external
          class="company-info-row-value external"
          style="padding-left: 60px;"
          >{{ item }}
        </f7-link>
      </div>
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
