<template>
  <div :style="'padding-bottom: 20px;'">
    <f7-navbar>
      <f7-nav-left
        ><f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link
      ></f7-nav-left>
      <f7-nav-title>
        Подарки
      </f7-nav-title>
      <f7-nav-right>
        <a
          class="external"
          @click="openBasket"
          v-if="showBasket"
          :style="'margin-right: -20px; margin-left: 20px;'"
        >
          <div v-if="giftCount" class="basket-counter">{{ giftCount }}</div>
          <img :src="require('../../images/basket.svg').default" />
        </a>
        <div v-else class="navbar-empty" />
      </f7-nav-right>
    </f7-navbar>
    <f7-page class="info">
      <div v-for="item in gifts" :key="item.id" class="gift-item-content">
        <div class="gift-item-image-container">
          <img
            v-if="item.product.files[0] && item.product.files[0].url"
            :src="item.product.files[0].url"
            class="gift-item-image"
          />
        </div>

        <div class="gift-item-text-container">
          <div class="gift-header">
            <p class="gift-item-text-head">{{ item.product.name }}</p>
            <p v-if="showBasket" class="gift-item-text-count">
              {{ item.count }} шт.
            </p>
          </div>
          <p class="gift-item-desc">{{ item.product.description }}</p>
          <div class="gift-header" :style="'margin-top: 20px'">
            <div>
              <p
                v-for="(item, index) in item.modificators"
                :key="index"
                class="gift-item-modificator"
              >
                {{ item.productModificator.description }}
              </p>
            </div>

            <div v-if="showBasket" class="gift-counter">
              <img
                :src="require('../../images/minus.svg').default"
                @click="handleGiftMinus(item)"
              />
              <div class="gift-item-number">{{ basketCount(item) }}</div>
              <img
                :src="require('../../images/plus.svg').default"
                @click="handleGiftPlus(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </f7-page>
  </div>
</template>

<script>
import Accordion from '../components/accordion'
import AppBar from '../components/appbar'
import { mapState, mapActions } from 'vuex'
import query from '../utils/axiosQuery'
import CONFIG from '../../../config'

export default {
  components: {
    Accordion,
    AppBar
  },

  data() {
    return { gifts: [] }
  },

  computed: {
    showBasket() {
      return this.modules.find((item) => item.systemName === 'Module Delivery')
    },
    giftCount() {
      return this.basket.reduce((acc, cur) => acc + cur.count, 0)
    },
    ...mapState({
      user: (state) => state.user,
      modules: (state) => state.modules,
      basket: (state) => state.basket
    })
  },

  async mounted() {
    document.addEventListener(
      'backbutton',
      (e) => {
        e.preventDefault()

        this.$f7router.back()
      },
      { once: true }
    )

    await query
      .get(CONFIG.API_URL + 'user/gifts/' + this.user.userId)
      .then((res) => {
        this.gifts = res.data.gifts
      })
      .catch((e) => {
        console.log(e)
      })
  },

  methods: {
    handleGiftMinus(item) {
      if (this.basket.find((el) => el.id === item.id)) {
        const newBasket = [...this.basket]
        newBasket.splice(
          this.basket.findIndex((el) => el.id === item.id),
          1
        )
        this.setBasket(newBasket)
        this.$forceUpdate()
      }
    },
    handleGiftPlus(item) {
      if (!this.basket.find((el) => el.id === item.id)) {
        this.addBasket({
          id: item.id,
          content: item.product.description,
          contentHeader: item.product.name,
          modificators: item.modificators.map(
            (item) => item.productModificator
          ),
          price: 0,
          count: 1,
          selectedComponents: item.components.map((item) => {
            return { count: item.count, productId: item.id }
          }),
          selectedModificators: item.modificators.map((item) => {
            return { productModificatorId: item.productModificator.id }
          }),
          show: true,
          type: 'gift'
        })
      }
    },
    openBasket() {
      if (this.giftCount) this.$f7router.navigate('/basket')
    },
    basketCount(product) {
      return this.basket.some((item) => item.id === product.id) ? 1 : 0
    },
    ...mapActions(['addBasket', 'setBasket'])
  }
}
</script>
