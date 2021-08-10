<template>
  <f7-page :page-content="false">
    <f7-navbar>
      <f7-nav-left></f7-nav-left>
      <f7-nav-title>
        Меню
      </f7-nav-title>
      <f7-nav-right>
        <a
          v-if="showBasket"
          class="external"
          @click="openBasket"
          :style="'margin-right: -20px; margin-left: 20px;'"
        >
          <div v-if="giftCount" class="basket-counter">{{ giftCount }}</div>
          <img :src="require('../../images/basket.svg').default" />
        </a>
        <div v-else class="navbar-empty" />
      </f7-nav-right>
    </f7-navbar>
    <div class="category-container" id="category">
      <div
        v-for="(val, i) in this.menu"
        :key="val.id"
        :class="
          selectedCategory === i
            ? 'category-link-item active'
            : 'category-link-item'
        "
        @click="slideToInstance(i)"
      >
        {{ val.name }}
      </div>
      <div :style="'width: 10px;'" />
    </div>
    <f7-swiper pagination id="category-swiper" @slideChange="onSlideChange">
      <f7-swiper-slide v-for="(val, i) in this.menu" :key="val.id">
        <accordion
          :showBasket="showBasket"
          :category="{
            id: menu[i].id,
            components: menu[i].components,
            items: menu[i].products.map((product) => {
              return {
                id: product.id,
                content: product.description,
                price:
                  product.modificators.length > 0
                    ? product.modificators[0].price + product.price
                    : product.price,
                initialPrice: product.price,
                contentHeader: product.name,
                modificator:
                  (product.modificators.length > 0 &&
                    product.modificators[0].description) ||
                  '',
                modificators: product.modificators,
                image: product.files[0],
                show: product.isShowForClient
              }
            })
          }"
        />
      </f7-swiper-slide>
    </f7-swiper>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import Accordion from '../components/accordion'
import AppBar from '../components/appbar'

export default {
  components: {
    Accordion,
    AppBar
  },
  mounted() {
    this.getSwiperInstance()
  },
  data() {
    return {
      mySwiperInstance: null,
      selectedCategory: 0
    }
  },
  computed: {
    showBasket() {
      return this.modules.find((item) => item.systemName === 'Module Delivery')
    },
    giftCount() {
      return this.basket.reduce((acc, cur) => acc + cur.count, 0)
    },
    filteredMenu() {
      return this.menu[this.selectedCategory]
    },
    ...mapState({
      active: (state) => state.activeRoute,
      menu: (state) => state.menu.filter((item) => item.isShowForClient),
      modules: (state) => state.modules,
      basket: (state) => state.basket
    })
  },
  methods: {
    openBasket() {
      if (this.giftCount) this.$f7router.navigate('/basket')
    },
    getSwiperInstance() {
      this.mySwiperInstance = this.$f7.swiper.get('#category-swiper')
      this.mySwiperInstance.on('slideNextTransitionEnd', () => {
        this.selectedCategory++
        document.getElementById('category').scrollTo({
          top: 0,
          left: 140 * (this.selectedCategory - 1),
          behavior: 'smooth'
        })
      })
      this.mySwiperInstance.on('slidePrevTransitionEnd', () => {
        this.selectedCategory--
        document.getElementById('category').scrollTo({
          top: 0,
          left: 140 * (this.selectedCategory - 1),
          behavior: 'smooth'
        })
      })
    },
    slideToInstance(index) {
      if (this.mySwiperInstance) {
        this.mySwiperInstance.slideTo(index, 0)
        this.selectedCategory = index
      }
    },
    onSlideChange(e) {
      console.log('slide change', e)
    }
  }
}
</script>
