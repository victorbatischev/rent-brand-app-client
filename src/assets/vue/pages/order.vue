<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left
        ><f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link
      ></f7-nav-left>
      <f7-nav-title>
        Оформление заказа
      </f7-nav-title>
      <f7-nav-right><div class="navbar-empty"/></f7-nav-right>
    </f7-navbar>

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

    <form ref="infoInputs" @submit="createOrder" class="info-inputs-block">
      <div class="info-date-input-block info-name-input">
        <div class="base-input-block">
          <p class="base-input-label">
            Дата доставки
          </p>
          <input class="base-input" v-model="date" type="date" />
        </div>
      </div>
      <div class="info-date-input-block info-name-input">
        <div class="base-input-block">
          <p class="base-input-label">
            Время начала доставки
          </p>
          <input class="base-input" type="time" name="timeStart" />
        </div>
      </div>
      <div class="info-date-input-block info-name-input">
        <div class="base-input-block">
          <p class="base-input-label">
            Время окончания доставки
          </p>
          <input class="base-input" type="time" name="timeFinish" />
        </div>
      </div>
      <base-input
        class="info-name-input"
        type="text"
        title="Адрес"
        name="address"
        :placeholder="'Добавьте адрес доставки'"
      />
      <base-input
        class="info-name-input"
        type="text"
        title="Квартира / Офис"
        name="flat"
        :placeholder="''"
      />
      <base-input
        class="info-name-input"
        type="text"
        title="Этаж"
        name="floor"
        :placeholder="''"
      />
      <base-input
        class="info-name-input"
        type="text"
        title="Подъезд"
        name="entrance"
        :placeholder="''"
      />
      <base-input
        class="info-name-input"
        type="text"
        title="Комментарий"
        name="comment"
        :placeholder="''"
      />
      <base-input
        class="info-name-input"
        type="number"
        title="Кол-во персон"
        name="person"
        :placeholder="'Выберите кол-во персон'"
      />
      <div class="order-payment">
        Способ оплаты
        <span class="order-payment-type">
          {{ this.payment }}
        </span>
        <img :src="require('../../images/money.svg').default" />
      </div>
      <base-input
        class="info-name-input"
        type="number"
        title="Сдача с"
        name="change"
        :placeholder="''"
      />
      <div class="basket-total-price">
        Итого: <b>{{ totalPrice }} ₽</b>
      </div>
      <primary-button
        class="info-submit-button"
        title="Оформить заказ"
        :style="'margin-top: 0px; margin-bottom: 20px;'"
      />
    </form>
  </f7-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Accordion from '../components/accordion'
import AppBar from '../components/appbar'
import PrimaryButton from '../components/primarybutton.vue'
import BaseInput from '../components/input'
import PreLoader from '../components/preloader'
import query from '../utils/axiosQuery'
import CONFIG from '../../../config'
import Datepicker from 'vuejs-datepicker'
import { ru } from 'vuejs-datepicker/dist/locale'

export default {
  components: {
    Accordion,
    AppBar,
    PrimaryButton,
    BaseInput,
    PreLoader,
    Datepicker
  },

  data() {
    return {
      date: '',
      address: '',
      flat: '',
      floor: '',
      entrance: '',
      comment: '',
      payment: 'Наличные',
      change: '',
      load: false,
      ru,
      toastText: '',
      activeToast: null
    }
  },

  computed: {
    totalPrice() {
      return this.basket.reduce((acc, cur) => acc + cur.price, 0)
    },
    ...mapState({
      menu: (state) => state.menu,
      basket: (state) => state.basket,
      user: (state) => state.user
    })
  },

  methods: {
    async createOrder(e) {
      e.preventDefault()

      const address = e.target.address.value
      const entrance = e.target.entrance.value
      const floor = e.target.floor.value
      const flat = e.target.flat.value
      const person = e.target.person.value || 1
      const timeStart = e.target.timeStart.value
      const timeFinish = e.target.timeFinish.value

      if (!address) {
        this.activeToast = true
        this.toastText = 'Укажите адрес доставки!'
        setTimeout(() => (this.activeToast = false), 2000)
      } else {
        await query
          .post(CONFIG.API_URL + 'order', {
            executeStart: `${this.date}T${timeStart}:00.000Z`,
            executeEnd: `${this.date}T${timeFinish}:00.000Z`,
            type: 'Доставка',
            volume: parseInt(person),
            stateName: 'new',
            includeLoyalityTypes: '',
            address: `Адрес: ${address}, Этаж: ${entrance}, Подъезд: ${floor}, Квартира / Офис: ${flat}`,
            companyId: CONFIG.COMPANY_ID,
            userId: this.user.userId
          })
          .then((res) => {
            if (res.status === 201) {
              this.activeToast = true
              this.toastText = 'Заказ успешно создан!'
              this.addProducts(res.data.id)
              this.addGifts(res.data.id)
              setTimeout(() => {
                this.activeToast = false
                this.setBasket([])
                this.$f7router.navigate('/main', {
                  clearPreviousHistory: true
                })
              }, 2000)
            } else {
              this.activeToast = true
              this.toastText = 'При создании заказа произошла ошибка!'
              setTimeout(() => (this.activeToast = false), 2000)
            }
          })
          .catch((e) => {
            this.activeToast = true
            this.toastText = 'При создании заказа произошла ошибка!'
            setTimeout(() => (this.activeToast = false), 2000)
          })
      }
    },
    async addProducts(id) {
      const basketProducts = this.basket
        .filter((item) => item.type === 'product')
        .map((product) => {
          return {
            productId: product.id,
            count: product.count,
            components: product.selectedComponents,
            modificators: product.selectedModificators
          }
        })
      await query
        .patch(CONFIG.API_URL + 'order/product/add-many/' + id, basketProducts)
        .catch((e) => {
          this.activeToast = true
          this.toastText = 'При добавлении продуктов к заказу произошла ошибка!'
          setTimeout(() => (this.activeToast = false), 2000)
        })
    },
    async addGifts(id) {
      const basketGifts = this.basket.filter((item) => item.type === 'gift')
      for (let item of basketGifts) {
        await query
          .patch(CONFIG.API_URL + 'order/gift/' + id, {
            giftId: item.id,
            count: item.count
          })
          .catch((e) => {
            this.activeToast = true
            this.toastText =
              'При добавлении подарков к заказу произошла ошибка!'
            setTimeout(() => (this.activeToast = false), 2000)
          })
      }
    },
    ...mapActions(['setBasket'])
  }
}
</script>
