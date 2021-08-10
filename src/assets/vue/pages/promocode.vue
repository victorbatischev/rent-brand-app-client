<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        Промокоды
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

    <form
      ref="infoInputs"
      @submit="activatePromocode"
      class="info-inputs-block"
    >
      <base-input
        class="info-name-input"
        type="text"
        title="Введите промокод"
        name="promocode"
      />
      <primary-button
        v-if="!promocodeActivated"
        class="info-submit-button"
        title="Применить"
      />
      <primary-button
        v-else
        class="info-submit-button"
        :style="{ color: '#fff', background: '#909090' }"
        title="Промокод применён"
      />
    </form>

    <div v-if="promocodeActivated" class="promocode-gift">
      <div class="promocode-gift-title">Ваш подарок</div>
      <div class="promocode-gift-container">
        <img :src="require('../../images/present.svg').default" />
        <div
          v-for="(item, id) in promocodeProducts"
          :key="id"
          class="promocode-gift-description"
        >
          {{ item }}
        </div>
      </div>
    </div>
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

export default {
  components: {
    BaseInput,
    PrimaryButton,
    AppBar,
    PreLoader
  },

  data() {
    return {
      promocode: '',
      load: false,
      promocodeActivated: false,
      toastText: '',
      activeToast: null,
      promocodeProducts: []
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
  },

  methods: {
    async activatePromocode(e) {
      e.preventDefault()

      this.promocodeActivated = false

      const promocode = e.target.promocode.value

      await query
        .post(CONFIG.API_URL + 'gift/code', {
          code: 0,
          name: promocode,
          by: /^\d+$/.test(promocode) ? 'code' : 'name',
          userId: this.user.userId,
          companyId: CONFIG.COMPANY_ID
        })
        .then((res) => {
          if (res.status === 201) {
            this.promocodeActivated = true
            this.promocodeProducts = res.data.map((item) => item.product.name)
            setTimeout(() => {
              this.promocodeActivated = false
              e.target.promocode.value = ''
              this.promocodeProducts = []
            }, 5000)
          } else {
            this.activeToast = true
            this.toastText = 'Проверьте правильность введённого промокода!'
            setTimeout(() => (this.activeToast = false), 2000)
          }
        })
        .catch((e) => {
          this.activeToast = true
          this.toastText = 'При отправке данных произошла ошибка!'
          setTimeout(() => (this.activeToast = false), 2000)
        })
    }
  }
}
</script>
