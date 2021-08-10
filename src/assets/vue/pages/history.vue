<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        История заказов
      </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>

    <f7-block>
      <div
        v-if="activeToast"
        :class="
          activeToast === null
            ? 'profile-toast hide'
            : activeToast === false
            ? 'profile-toast close'
            : 'profile-toast'
        "
      >
        <p class="profile-toast-text">
          {{ toastText }}
        </p>
      </div>

      <div v-if="showReview" class="history-modal-review">
        <div class="history-modal-review-header">
          <div class="history-order-number-modal">
            Заказ №{{ selectedOrder.orderNumber }}
          </div>
          <div @click="closeReview">
            <img :src="require('../../images/close.svg').default" />
          </div>
        </div>
        <form
          ref="infoInputs"
          @submit="sendReview"
          class="info-inputs-block"
          :style="'padding: 20px'"
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

      <div
        v-for="item in orders"
        :key="item.id"
        @click="openOrder(item)"
        class="history-item-content"
      >
        <div class="booking-modal-addresses-header">
          <div class="history-order-number">Заказ №{{ item.orderNumber }}</div>
          <div class="history-order-date">{{ getDate(item.executeStart) }}</div>
        </div>
        <div class="history-order-price">{{ item.price }} ₽</div>
        <div
          class="history-order-noreview"
          v-if="!item.review"
          @click="selectOrder(item)"
        >
          Оцените заказ
        </div>
        <div v-else :style="'display: flex'">
          Ваша оценка
          <star-rating
            :star-size="20"
            :rating="item.review.rating"
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
    </f7-block>
  </f7-page>
</template>

<script>
import BaseInput from '../components/input'
import PrimaryButton from '../components/primarybutton'
import AppBar from '../components/appbar'
import PreLoader from '../components/preloader'
import { mapState } from 'vuex'
import query from '../utils/axiosQuery'
import CONFIG from '../../../config'
import moment from 'moment'
import StarRating from 'vue-star-rating'

export default {
  components: {
    BaseInput,
    PrimaryButton,
    AppBar,
    PreLoader,
    StarRating
  },

  data() {
    return {
      orders: [],
      load: false,
      showReview: false,
      selectedOrder: null,
      star: 0,
      toastText: '',
      activeToast: null,
      CONFIG
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user
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

    this.getOrders()
  },

  methods: {
    openOrder(item) {
      this.$f7router.navigate('/historyOrder', {
        props: {
          data: item
        }
      })
    },

    selectOrder(item) {
      this.selectedOrder = item
      this.showReview = true
    },

    getDate(value) {
      return moment(value).format('HH:mm')
    },

    closeReview() {
      this.showReview = false
      this.selectedOrder = null
      this.star = 0

      this.getOrders()
    },

    async getOrders() {
      await query
        .get(
          `${CONFIG.API_URL}order/search/${CONFIG.COMPANY_ID}?userId=${this.user.userId}`
        )
        .then((res) => {
          this.orders = res.data.orders
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async sendReview(e) {
      e.preventDefault()

      const comment = e.target.comment.value

      await query
        .patch(CONFIG.API_URL + 'order/review/' + this.selectedOrder.id, {
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
