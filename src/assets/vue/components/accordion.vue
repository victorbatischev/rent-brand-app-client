<template>
  <f7-page
    :style="'padding-top: 60px'"
    :class="'block accordion-list custom-accordion'"
  >
    <accordion-item
      :key="category.id"
      :items="filteredItems"
      :showBasket="showBasket"
      @selected="handleSelectItem"
    />

    <detailed
      v-if="openDetailed"
      :data="detailedItem"
      :components="category.components"
      :openDetailed="openDetailed"
      @closed="handleCloseItem"
    />
  </f7-page>
</template>

<script>
import AccordionItem from './accordionitem'
import Detailed from '../pages/detailed'

export default {
  components: { AccordionItem, Detailed },
  props: ['category', 'showBasket'],
  data() {
    return {
      openDetailed: false,
      detailedItem: null
    }
  },
  computed: {
    filteredItems() {
      return this.category.items.filter((item) => item.show)
    }
  },
  methods: {
    handleSelectItem(value) {
      // this.$f7router.navigate('/detailed', {
      //   props: {
      //     data: value,
      //     components: this.category.components
      //   }
      // })

      this.detailedItem = value
      this.openDetailed = true
    },
    handleCloseItem() {
      this.openDetailed = false
      this.detailedItem = null
    }
  }
}
</script>
