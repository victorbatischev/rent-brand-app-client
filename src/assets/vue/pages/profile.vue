<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-title>
        Аккаунт
      </f7-nav-title>
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
      <div class="info-profile-name">
        {{ name }}
      </div>
      <div class="info-profile-phone">
        {{ phone }}
      </div>
      <div class="info-pencil-block">
        <p @click="navigate('/edit')" class="info-pencil-text">
          Редактировать
        </p>
      </div>
    </f7-block>
    <f7-block>
      <button
        @click="navigate('/history')"
        class="primary-button profile-button"
      >
        <img :src="require('../../images/history.svg').default" />
        История заказов
      </button>
      <button
        v-if="showBooking"
        @click="navigate('/booking')"
        class="primary-button profile-button"
      >
        <img :src="require('../../images/booking.svg').default" />
        Бронирование
      </button>
      <button @click="navigate('/gifts')" class="primary-button profile-button">
        <img :src="require('../../images/gift.svg').default" />
        Мои подарки
      </button>
      <button
        v-if="showPromo"
        @click="navigate('/promocode')"
        class="primary-button profile-button"
      >
        <img :src="require('../../images/promocode.svg').default" />
        Промокоды
      </button>
      <button @click="navigate('/info')" class="primary-button profile-button">
        <img :src="require('../../images/info.svg').default" />
        О компании
      </button>
      <button
        v-if="showInvite"
        @click="inviteFriend"
        class="primary-button"
        :style="
          `margin-top: 12px; background: ${CONFIG.TERTIARY_COLOR}; color: #000`
        "
      >
        Пригласить друга
      </button>
      <button
        @click="exitAccount"
        class="primary-button"
        :style="{ color: '#333333', background: '#f2f2f2' }"
      >
        Выйти из аккаунта
      </button>
    </f7-block>

    <f7-link v-if="advertShow" @click="openSite">
      <div class="info-company-footer">
        <p class="footer-header-text">Rent Brand App</p>
        <p class="footer-header-desc">
          Мобильное приложение
        </p>
        <p class="footer-header-desc">
          с программой лояльности
        </p>
      </div>
    </f7-link>
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
      name: '',
      email: '',
      birthday: '',
      phone: '',
      load: false,
      toastText: '',
      activeToast: null,
      privacy: '',
      CONFIG,
      advertShow: false
    }
  },

  computed: {
    showBooking() {
      return this.modules.find((item) => item.systemName === 'Module Booking')
    },
    showPromo() {
      return this.modules.find(
        (item) => item.systemName === 'Module Promo Codes'
      )
    },
    showInvite() {
      return this.modules.find(
        (item) => item.systemName === 'Module Invite Friend'
      )
    },
    ...mapState({
      user: (state) => state.user,
      modules: (state) => state.modules
    })
  },

  watch: {
    birthday() {
      this.$forceUpdate()
    },
    user() {
      this.name = this.user.name
    }
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
      .get(CONFIG.API_URL + 'user/' + this.user.userId)
      .then((res) => {
        this.birthday = res.data.birthday || 'Отсутствует'
        this.email = res.data.email || 'Отсутствует'
        this.name = res.data.name || ''
        this.phone = res.data.phone || 'Отсутствует'
        this.load = false
      })
      .catch((e) => {
        console.log(e)
      })

    await query
      .get(CONFIG.API_URL + 'company/' + CONFIG.COMPANY_ID)
      .then((res) => {
        this.privacy = res.data.privacy
        this.advertShow = !res.data.isAdvertShow
      })
  },

  methods: {
    navigate(screen) {
      this.$f7router.navigate(screen)
    },

    async inviteFriend() {
      await query
        .post(CONFIG.API_URL + 'promocode/personal', {
          userId: this.user.userId,
          companyId: CONFIG.COMPANY_ID
        })
        .then((res) => {
          if (window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share(
              'Приглашаю скачать мобильное приложение ' +
                CONFIG.COMPANY_NAME +
                ' и воспользоваться промокодом ' +
                res.data.code +
                ' для получения подарков!'
            )
          }
        })
    },

    exitAccount() {
      this.$f7.dialog.confirm(
        'Вы уверены что хотите выйти из аккаунта?',
        'Внимание!',
        () => {
          localStorage.clear()
          window.location.reload()
        }
      )
    },

    openSite: function() {
      window.open('https://rentbrand.app/', '_system')
    }
  }
}
</script>
