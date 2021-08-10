<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left
        ><f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link
      ></f7-nav-left>
      <f7-nav-title>
        Корзина
      </f7-nav-title>
      <f7-nav-right>
        <a class="external" :style="'margin-right: -20px; margin-left: 20px;'">
          <div v-if="giftCount" class="basket-counter">{{ giftCount }}</div>
          <img :src="require('../../images/basketActive.svg').default" />
        </a>
      </f7-nav-right>
    </f7-navbar>

    <f7-popover class="popover-menu">
      <f7-list>
        <f7-list-item
          link="#"
          no-chevron
          popover-close
          title="Очистить корзину"
          @click="clearBasket"
        ></f7-list-item>
      </f7-list>
    </f7-popover>

    <f7-block>
      <div
        v-for="(item, index) in basket"
        :key="index"
        class="basket-item-content"
      >
        <div class="basket-item-image-container">
          <img
            v-if="item.image && item.image.url"
            :src="item.image.url"
            class="basket-item-image"
          />
        </div>

        <div class="basket-item-text-container">
          <div class="basket-header">
            <p class="basket-item-text-head">{{ item.contentHeader }}</p>
            <img
              @click="deleteBasketItem(index)"
              :src="require('../../images/delete.svg').default"
            />
          </div>
          <p
            v-for="el in item.selectedModificators"
            :key="el.productModificatorId"
            class="basket-item-modificator"
          >
            {{ modificatorName(item.modificators, el.productModificatorId) }}
          </p>
          <div class="basket-item-price">{{ item.price }} ₽</div>
        </div>
      </div>
      <div class="basket-total-price">
        Итого: <b>{{ totalPrice }} ₽</b>
      </div>
      <form @submit="openOrder">
        <primary-button
          class="info-submit-button"
          :title="'Оформить заказ ' + totalPrice + ' ₽'"
          :style="'margin-top: 0px; margin-bottom: 20px;'"
        />
      </form>
    </f7-block>
  </f7-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Accordion from '../components/accordion'
import AppBar from '../components/appbar'
import PrimaryButton from '../components/primarybutton'

export default {
  components: {
    Accordion,
    AppBar,
    PrimaryButton
  },
  methods: {
    modificatorName(item, el) {
      return item.find((mod) => mod.id === el).description
    },
    deleteBasketItem(index) {
      this.$f7.dialog.confirm(
        'Вы действительно хотите удалить товар из корзины?',
        'Внимание!',
        () => {
          const newBasket = [...this.basket]
          newBasket.splice(index, 1)
          this.setBasket(newBasket)
          if (!newBasket.length) this.$f7router.back()
        }
      )
    },
    clearBasket() {
      this.$f7.dialog.confirm(
        'Вы уверены что хотите очистить корзину?',
        'Внимание!',
        () => {
          this.setBasket([])
          this.$f7router.back()
        }
      )
    },
    openOrder(e) {
      e.preventDefault()

      this.$f7router.navigate('/order')
    },
    ...mapActions(['setBasket'])
  },

  computed: {
    giftCount() {
      return this.basket.reduce((acc, cur) => acc + cur.count, 0)
    },
    totalPrice() {
      return this.basket.reduce((acc, cur) => acc + cur.price, 0)
    },
    ...mapState({
      menu: (state) => state.menu,
      basket: (state) => state.basket
    })
  }
}
</script>
