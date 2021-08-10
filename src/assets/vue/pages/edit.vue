<template>
  <f7-page class="info">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-f7="chevron_left" @click="$f7router.back()"></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        Редактировать
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

    <form ref="infoInputs" @submit="pushUserInfo" class="info-inputs-block">
      <base-input
        class="info-name-input"
        type="text"
        title="Имя"
        placeholder="Введите ваше имя"
        v-model="name"
      />
      <div class="info-date-input-block info-name-input">
        <div class="base-input-block">
          <p class="base-input-label">
            Дата рождения DD/MM/YYYY
          </p>
          <input class="base-input" v-model="birthday" type="date" />
        </div>
      </div>
      <base-input
        class="info-name-input"
        type="tel"
        :disabled="true"
        title="Номер телефона"
        placeholder="Введите ваш номер телефона"
        v-model="phone"
      />
      <base-input
        class="info-name-input"
        type="email"
        title="E-mail"
        placeholder="Введите ваш e-mail"
        v-model="email"
      />
      <primary-button class="info-submit-button" title="Сохранить" />
    </form>
    <div class="info-privacy-block">
      <f7-link @click="openPrivacy" class="info-privacy-text"
        >Политика конфиденциальности
      </f7-link>
    </div>
  </f7-page>
</template>

<script>
import BaseInput from '../components/input'
import PrimaryButton from '../components/primarybutton'
import AppBar from '../components/appbar'
import PreLoader from '../components/preloader'
import { mapState, mapActions } from 'vuex'
import query from '../utils/axiosQuery'
import CONFIG from '../../../config'
import Datepicker from 'vuejs-datepicker'
import { ru } from 'vuejs-datepicker/dist/locale'
import moment from 'moment'

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
      birthdayEdit: 'text',
      name: '',
      email: '',
      birthday: '',
      phone: '',
      login: '',
      load: false,
      ru,
      toastText: '',
      activeToast: null,
      privacy: ''
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user
    })
  },

  watch: {
    birthday() {
      this.$forceUpdate()
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

    this.getUserData()

    await query
      .get(CONFIG.API_URL + 'company/' + CONFIG.COMPANY_ID)
      .then((res) => {
        this.privacy = res.data.privacy
      })
  },

  methods: {
    openPrivacy() {
      if (this.privacy.length > 0) {
        window.open(this.privacy, '_system')
      } else {
        this.$f7.dialog.alert(
          'К сожалению, Политика конфиденциальности еще не добавлена',
          CONFIG.COMPANY_NAME
        )
      }
    },

    getDate() {
      return moment(this.birthday).format('DD/MM/YYY')
    },

    showEditDate(e) {
      this.birthdayEdit = 'date'
      e.target.focus()
    },

    async pushUserInfo(e) {
      e.preventDefault()

      await query
        .patch(CONFIG.API_URL + 'user/' + this.user.userId, {
          login: this.login,
          // если поле пустое, используем сохранённое имя
          name: this.name,
          status: 'active',
          phone: this.phone,
          // если дата рождения не указана, не добавляем поле
          ...(this.birthday && { birthday: this.birthday }),
          // если e-mail рождения не указан, не добавляем поле
          ...(this.email && { email: this.email })
        })
        .then((res) => {
          if (res.status === 200) {
            this.activeToast = true
            this.toastText = 'Данные профиля успешно обновлены!'
            setTimeout(() => (this.activeToast = false), 2000)
            this.userLogged({ ...this.user, name: this.name })
          } else {
            this.activeToast = true
            this.toastText = 'При обновлении данных произошла ошибка!'
            setTimeout(() => (this.activeToast = false), 2000)
          }
        })
        .catch((e) => {
          this.activeToast = true
          this.toastText = 'При обновлении данных произошла ошибка!'
          setTimeout(() => (this.activeToast = false), 2000)
        })
        .finally(() => this.getUserData())
    },

    async getUserData() {
      await query
        .get(CONFIG.API_URL + 'user/' + this.user.userId)
        .then((res) => {
          this.birthday = res.data.birthday || null
          this.email = res.data.email || null
          this.name = res.data.name || null
          this.phone = res.data.phone || null
          this.login = res.data.login || null
          this.load = false
        })
        .catch((e) => {
          console.log(e)
        })
    },
    ...mapActions(['userLogged'])
  }
}
</script>
