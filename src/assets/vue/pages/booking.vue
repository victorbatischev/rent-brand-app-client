<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        Бронирование
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

      <div class="booking-address">
        <img :src="require('../../images/location.svg').default" />
        <p @click="openAddress">{{ address }}</p>
      </div>

      <div v-show="showAddress" class="booking-modal-addresses">
        <div class="booking-modal-addresses-header">
          <div class="booking-title">Выберите точку</div>
          <div @click="showAddress = false">
            <img :src="require('../../images/close.svg').default" />
          </div>
        </div>
        <div
          v-for="item in places"
          :key="item.id"
          class="booking-item-content"
          @click="selectAddress(item)"
        >
          <div class="booking-address-description">{{ item.description }}</div>
          <div class="booking-address-name">{{ item.address }}</div>
        </div>
      </div>

      <form ref="infoInputs" @submit="createOrder" class="info-inputs-block">
        <base-input
          class="info-name-input"
          type="text"
          title="Адрес"
          name="address"
          :placeholder="'Укажите адрес доставки'"
        />
        <div class="info-date-input-block info-name-input">
          <div class="base-input-block">
            <p class="base-input-label">
              Дата бронирования
            </p>
            <input class="base-input" v-model="date" type="date" />
          </div>
        </div>
        <div class="info-date-input-block info-name-input">
          <div class="base-input-block">
            <p class="base-input-label">
              Время бронирования
            </p>
            <input class="base-input" v-model="time" type="time" />
          </div>
        </div>
        <base-input
          class="info-name-input"
          type="number"
          title="Кол-во персон"
          name="person"
          :placeholder="'Выберите кол-во персон'"
        />
        <base-input
          class="info-name-input"
          type="text"
          title="Комментарий"
          name="comment"
          :placeholder="'Добавьте комментарий'"
        />
        <primary-button class="info-submit-button" title="Забронировать" />
      </form>
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
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    BaseInput,
    PrimaryButton,
    AppBar,
    PreLoader,
    Datepicker
  },

  data() {
    return {
      showAddress: false,
      address: '',
      name: '',
      date: '',
      time: '',
      person: 1,
      comment: '',
      places: [],
      toastText: '',
      activeToast: null
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

    await query
      .get(`${CONFIG.API_URL}company/${CONFIG.COMPANY_ID}/addresses`)
      .then(async (res) => {
        this.address = res.data.addresses[0].address
        this.places = res.data.addresses
      })

    await query
      .get(CONFIG.API_URL + 'company/' + CONFIG.COMPANY_ID)
      .then((res) => {
        this.privacy = res.data.privacy
      })
  },

  methods: {
    openAddress() {
      if (this.places.length > 1) this.showAddress = true
    },

    selectAddress(item) {
      this.address = item.address
      this.showAddress = false
    },

    async createOrder(e) {
      e.preventDefault()

      const address = e.target.address.value
      const person = e.target.person.value || 1

      if (!address) {
        this.activeToast = true
        this.toastText = 'Укажите адрес доставки!'
        setTimeout(() => (this.activeToast = false), 2000)
      } else {
        await query
          .post(CONFIG.API_URL + 'order', {
            executeStart: `${this.date}T${this.time}:00.000Z`,
            executeEnd: `${this.date}T${this.time}:00.000Z`,
            type: 'Бронирование',
            volume: parseInt(person),
            stateName: 'new',
            includeLoyalityTypes: '',
            address: address,
            companyId: CONFIG.COMPANY_ID,
            userId: this.user.userId,
            companyAddressId: this.places.find(
              (item) => item.address === this.address
            ).id
          })
          .then((res) => {
            if (res.status === 201) {
              this.activeToast = true
              this.toastText = 'Заказ успешно создан!'
              setTimeout(() => (this.activeToast = false), 2000)
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
    }
  }
}
</script>
