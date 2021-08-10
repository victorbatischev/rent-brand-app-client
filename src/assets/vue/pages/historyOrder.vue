<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left
        ><f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link
      ></f7-nav-left>
      <f7-nav-title> Заказ №{{ data.orderNumber }} </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>
    <f7-block v-if="orderData">
      <div v-if="showReview" class="history-modal-review">
        <div class="history-modal-review-header">
          <div class="history-order-number-modal">
            Заказ №{{ orderData.orderNumber }}
          </div>
          <div @click="closeReview">
            <img :src="require('../../images/close.svg').default" />
          </div>
        </div>
        <form
          ref="infoInputs"
          @submit="sendReview"
          class="info-inputs-block"
          :style="'padding: 20px; padding-bottom: 0px;'"
        >
          <div class="history-order-star">Оцените заказ</div>
          <star-rating
            :star-size="50"
            :rating="star"
            @rating-selected="star = $event"
            :active-color="CONFIG.TERTIARY_COLOR"
            inactive-color="#FFFFFF"
            :border-width="4"
            :border-color="CONFIG.TERTIARY_COLOR"
            :rounded-corners="true"
            :show-rating="false"
            :animate="true"
          />
          <base-input
            class="info-name-input"
            type="text"
            title="Комментарий к заказу"
            name="comment"
          />
          <primary-button
            class="primary-button"
            :style="'margin-top: 20px'"
            title="Отправить отзыв"
          />
        </form>
      </div>

      <div class="center-text">
        <div class="history-order-number">
          Заказ №{{ orderData.orderNumber }}
        </div>
        <div class="history-order-date">
          {{ getDate(orderData.executeStart) }}
        </div>
        <div class="history-order-price">{{ orderData.price }} ₽</div>
        <div
          class="history-order-noreview"
          v-if="!orderData.review"
          @click="selectOrder()"
        >
          Оцените заказ
        </div>
        <div v-else :style="'display: flex'">
          Ваша оценка
          <star-rating
            :star-size="20"
            :rating="orderData.review.rating"
            :active-color="CONFIG.TERTIARY_COLOR"
            inactive-color="#FFFFFF"
            :border-width="2"
            :border-color="CONFIG.TERTIARY_COLOR"
            :rounded-corners="true"
            :show-rating="false"
            :animate="true"
            :read-only="true"
            :style="'margin-left: 5px; margin-top: -3px'"
          />
        </div>
      </div>

      <div
        v-for="(item, index) in orderData.orderProducts"
        :key="index"
        class="basket-item-content"
      >
        <div class="basket-item-image-container">
          <img
            v-if="item.product.image && item.product.image.url"
            :src="item.product.image.url"
            class="basket-item-image"
          />
        </div>

        <div class="basket-item-text-container">
          <div class="basket-header">
            <p class="basket-item-text-head">{{ item.product.name }}</p>
          </div>
          <p
            v-for="el in item.modificators"
            :key="el.id"
            class="basket-item-modificator"
          >
            {{ el.name }}
          </p>
          <div class="basket-item-price">{{ item.price }} ₽</div>
        </div>
      </div>
      <form @submit="repeatOrder" :style="'margin-bottom: 20px;'">
        <primary-button class="info-submit-button" :title="'Повторить заказ'" />
      </form>
    </f7-block>
    <pre-loader v-else />
  </f7-page>
</template>

<script>
import BaseInput from '../components/input'
import Accordion from '../components/accordion'
import AppBar from '../components/appbar'
import PrimaryButton from '../components/primarybutton'
import query from '../utils/axiosQuery'
import CONFIG from '../../../config'
import moment from 'moment'
import StarRating from 'vue-star-rating'
import PreLoader from '../components/preloader'

export default {
  components: {
    Accordion,
    AppBar,
    PrimaryButton,
    BaseInput,
    StarRating,
    PreLoader
  },

  props: ['data'],

  data() {
    return {
      showReview: false,
      star: 0,
      toastText: '',
      activeToast: null,
      orderData: null,
      CONFIG
    }
  },

  async mounted() {
    this.getOrderData()
  },

  methods: {
    modificatorName(item, el) {
      return item.find((mod) => mod.id === el).description
    },

    repeatOrder(e) {
      e.preventDefault()
    },

    selectOrder() {
      this.showReview = true
    },

    getDate(value) {
      return moment(value).format('DD MMMM YYYY HH:mm')
    },

    closeReview() {
      this.showReview = false
      this.star = 0
      this.getOrderData()
    },

    async getOrderData() {
      await query.get(CONFIG.API_URL + 'order/' + this.data.id).then((res) => {
        this.orderData = res.data
      })
    },

    async sendReview(e) {
      e.preventDefault()

      const comment = e.target.comment.value

      await query
        .patch(CONFIG.API_URL + 'order/review/' + this.data.id, {
          rating: this.star,
          comment
        })
        .then((res) => {
          if (res.status === 200) {
            this.activeToast = true
            this.toastText = 'Отзыв успешно добавлен!'
            setTimeout(() => (this.activeToast = false), 2000)
          } else {
            this.activeToast = true
            this.toastText = 'При добавлении отзыва произошла ошибка!'
            setTimeout(() => (this.activeToast = false), 2000)
          }
        })
        .catch((e) => {
          this.activeToast = true
          this.toastText = 'При добавлении отзыва произошла ошибка!'
          setTimeout(() => (this.activeToast = false), 2000)
        })
        .finally(() => {
          e.target.comment.value = ''
          this.closeReview()
        })
    }
  }
}
</script>
